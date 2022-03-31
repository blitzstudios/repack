"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DevServerPlugin = void 0;

var _child_process = require("child_process");

var _webpack = _interopRequireDefault(require("webpack"));

var _reactRefreshWebpackPlugin = _interopRequireDefault(require("@pmmmwh/react-refresh-webpack-plugin"));

var _server = require("../../../server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class for running development server that handles serving the built bundle, all assets as well as
 * providing Hot Module Replacement functionality.
 *
 * @category Webpack Plugin
 */
class DevServerPlugin {
  /**
   * Constructs new `DevServerPlugin`.
   *
   * @param config Plugin configuration options.
   */
  constructor(config) {
    var _this$config$hmr, _this$config, _this$config$enabled;

    this.config = config;
    this.config.hmr = (_this$config$hmr = (_this$config = this.config) === null || _this$config === void 0 ? void 0 : _this$config.hmr) !== null && _this$config$hmr !== void 0 ? _this$config$hmr : true;
    this.config.enabled = (_this$config$enabled = this.config.enabled) !== null && _this$config$enabled !== void 0 ? _this$config$enabled : true;
  }
  /**
   * Apply the plugin.
   *
   * @param compiler Webpack compiler instance.
   */


  apply(compiler) {
    var _this$config2;

    const logger = compiler.getInfrastructureLogger('DevServerPlugin');

    if (this.config.enabled && this.config.platform === 'android') {
      this.runAdbReverse(logger);
    }

    new _webpack.default.DefinePlugin({
      __PUBLIC_PORT__: JSON.stringify(this.config.port)
    }).apply(compiler);

    if ((_this$config2 = this.config) !== null && _this$config2 !== void 0 && _this$config2.hmr) {
      new _webpack.default.HotModuleReplacementPlugin().apply(compiler);
      new _reactRefreshWebpackPlugin.default({
        overlay: false
      }).apply(compiler); // To avoid the problem from https://github.com/facebook/react/issues/20377
      // we need to move React Refresh entry that `ReactRefreshPlugin` injects to evaluate right
      // before the `WebpackHMRClient` and after `InitializeCore` which sets up React DevTools.
      // Thanks to that the initialization order is correct:
      // 0. Polyfills
      // 1. `InitilizeCore` -> React DevTools
      // 2. Rect Refresh Entry
      // 3. `WebpackHMRClient`

      const getAdjustedEntry = entry => {
        for (const key in entry) {
          const {
            import: entryImports = []
          } = entry[key];
          const refreshEntryIndex = entryImports.findIndex(value => /ReactRefreshEntry\.js/.test(value));

          if (refreshEntryIndex >= 0) {
            const refreshEntry = entryImports[refreshEntryIndex];
            entryImports.splice(refreshEntryIndex, 1);
            const hmrClientIndex = entryImports.findIndex(value => /WebpackHMRClient\.js/.test(value));
            entryImports.splice(hmrClientIndex, 0, refreshEntry);
          }

          entry[key].import = entryImports;
        }

        return entry;
      };

      if (typeof compiler.options.entry !== 'function') {
        compiler.options.entry = getAdjustedEntry(compiler.options.entry);
      } else {
        const getEntry = compiler.options.entry;

        compiler.options.entry = async () => {
          const entry = await getEntry();
          return getAdjustedEntry(entry);
        };
      }
    }

    let server;
    const context = compiler.context;
    compiler.hooks.watchRun.tapPromise('DevServerPlugin', async () => {
      if (!server && this.config.enabled) {
        server = new _server.DevServer({ ...this.config,
          context
        }, compiler);
        await server.run();
      }
    });
  }

  runAdbReverse(logger) {
    // TODO: add support for multiple devices
    const adbPath = process.env.ANDROID_HOME ? `${process.env.ANDROID_HOME}/platform-tools/adb` : 'adb';
    const command = `${adbPath} reverse tcp:${this.config.port} tcp:${this.config.port}`;
    (0, _child_process.exec)(command, error => {
      if (error) {
        // Get just the error message
        const message = error.message.split('error:')[1] || error.message;
        logger.warn(`Failed to run: ${command} - ${message.trim()}`);
      } else {
        logger.info(`Successfully run: ${command}`);
      }
    });
  }

}

exports.DevServerPlugin = DevServerPlugin;
//# sourceMappingURL=DevServerPlugin.js.map