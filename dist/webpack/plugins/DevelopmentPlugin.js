"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DevelopmentPlugin = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

var _reactRefreshWebpackPlugin = _interopRequireDefault(require("@pmmmwh/react-refresh-webpack-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class for running development server that handles serving the built bundle, all assets as well as
 * providing Hot Module Replacement functionality.
 *
 * @category Webpack Plugin
 */
class DevelopmentPlugin {
  /**
   * Constructs new `DevelopmentPlugin`.
   *
   * @param config Plugin configuration options.
   */
  constructor(config) {
    this.config = config;
  }
  /**
   * Apply the plugin.
   *
   * @param compiler Webpack compiler instance.
   */


  apply(compiler) {
    var _this$config, _this$config2;

    if (!((_this$config = this.config) !== null && _this$config !== void 0 && _this$config.devServer)) {
      return;
    }

    new _webpack.default.DefinePlugin({
      __PUBLIC_PORT__: JSON.stringify(this.config.devServer.port),
      __PLATFORM__: JSON.stringify(this.config.platform),
      __LISTENER_IP__: JSON.stringify(this.config.listenerIP)
    }).apply(compiler);

    if ((_this$config2 = this.config) !== null && _this$config2 !== void 0 && _this$config2.devServer.hmr) {
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
  }

}

exports.DevelopmentPlugin = DevelopmentPlugin;
//# sourceMappingURL=DevelopmentPlugin.js.map