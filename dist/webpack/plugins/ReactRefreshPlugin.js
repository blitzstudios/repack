"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactRefreshPlugin = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

var _reactRefreshWebpackPlugin = _interopRequireDefault(require("@pmmmwh/react-refresh-webpack-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class for setting up Hot Module Replacement and React Refresh support using `@pmmmwh/react-refresh-webpack-plugin`.
 *
 * @category Webpack Plugin
 */
class ReactRefreshPlugin {
  /**
   * Constructs new `ReactRefreshPlugin`.
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
    var _this$config;

    if (!this.config) {
      return;
    }

    new _webpack.default.DefinePlugin({
      __PUBLIC_PORT__: JSON.stringify(this.config.port),
      __PLATFORM__: JSON.stringify(this.config.platform)
    }).apply(compiler);

    if ((_this$config = this.config) !== null && _this$config !== void 0 && _this$config.hmr) {
      new _webpack.default.HotModuleReplacementPlugin().apply(compiler);
      new _reactRefreshWebpackPlugin.default({
        overlay: false
      }).apply(compiler); // To avoid the problem from https://github.com/facebook/react/issues/20377
      // we need to move React Refresh entry that `ReactRefreshWebpackPlugin` injects, to evaluate right
      // before the `WebpackHMRClient` and after `InitializeCore` which sets up React DevTools.
      // Thanks to that the initialization order is correct:
      // 0. Polyfills
      // 1. `InitilizeCore` -> React DevTools
      // 2. React Refresh Entry
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

exports.ReactRefreshPlugin = ReactRefreshPlugin;
//# sourceMappingURL=ReactRefreshPlugin.js.map