"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RepackPlugin = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

var _AssetsResolverPlugin = require("./AssetsResolverPlugin");

var _DevelopmentPlugin = require("./DevelopmentPlugin");

var _LoggerPlugin = require("./LoggerPlugin");

var _OutputPlugin = require("./OutputPlugin");

var _RepackTargetPlugin = require("./RepackTargetPlugin");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Webpack plugin, which abstracts configuration of other Re.Pack's plugin
 * to make Webpack config more readable.
 *
 * @example Usage in Webpack config (ESM):
 * ```ts
 * import * as Repack from '@callstack/repack';
 *
 * export default (env) => {
 *   const {
 *     mode = 'development',
 *     platform,
 *     devServer = undefined,
 *   } = env;
 *
 *   return {
 *     plugins: [
 *       new Repack.RepackPlugin({
 *         mode,
 *         platform,
 *         devServer,
 *       }),
 *     ],
 *   };
 * };
 * ```
 *
 * Internally, `RepackPlugin` configures the following plugins:
 * - `webpack.DefinePlugin` with `__DEV__` global
 * - {@link AssetsResolverPlugin}
 * - {@link OutputPlugin}
 * - {@link DevelopmentPlugin}
 * - {@link RepackTargetPlugin}
 * - `webpack.SourceMapDevToolPlugin`
 * - {@link LoggerPlugin}
 *
 * `RepackPlugin` provides a sensible defaults, but can be customized to some extent.
 * If you need more control, it's recommended to remove `RepackPlugin` and use other plugins
 * directly, eg:
 * ```ts
 * import React from '@callstack/repack';
 *
 * new Repact.plugins.AssetsResolverPlugin();
 * ```
 *
 * @category Webpack Plugin
 */
class RepackPlugin {
  /**
   * Constructs new `RepackPlugin`.
   *
   * @param config Plugin configuration options.
   */
  constructor(config) {
    this.config = config;
    this.config.sourceMaps = this.config.sourceMaps ?? true;
    this.config.logger = this.config.logger ?? true;
  }
  /**
   * Apply the plugin.
   *
   * @param compiler Webpack compiler instance.
   */


  apply(compiler) {
    var _this$config, _this$config$devServe;

    new _webpack.default.DefinePlugin({
      __DEV__: JSON.stringify(this.config.mode === 'development'),
      __E2E__: JSON.stringify(process.env.E2E)
    }).apply(compiler);
    new _AssetsResolverPlugin.AssetsResolverPlugin({
      platform: this.config.platform
    }).apply(compiler);
    new _OutputPlugin.OutputPlugin({
      platform: this.config.platform,
      enabled: !this.config.devServer,
      context: this.config.context,
      output: this.config.output,
      extraChunks: this.config.extraChunks
    }).apply(compiler);
    new _DevelopmentPlugin.DevelopmentPlugin({
      platform: this.config.platform,
      devServer: this.config.devServer,
      listenerIP: (_this$config = this.config) === null || _this$config === void 0 ? void 0 : _this$config.listenerIP
    }).apply(compiler);
    new _RepackTargetPlugin.RepackTargetPlugin({
      hmr: (_this$config$devServe = this.config.devServer) === null || _this$config$devServe === void 0 ? void 0 : _this$config$devServe.hmr
    }).apply(compiler);

    if (this.config.sourceMaps) {
      new _webpack.default.SourceMapDevToolPlugin({
        test: /\.(js)?bundle$/,
        exclude: /\.chunk\.(js)?bundle$/,
        filename: '[file].map',
        append: `//# sourceMappingURL=[url]?platform=${this.config.platform}`
      }).apply(compiler);
      new _webpack.default.SourceMapDevToolPlugin({
        test: /\.(js)?bundle$/,
        include: /\.chunk\.(js)?bundle$/,
        filename: '[file].map',
        append: `//# sourceMappingURL=[url]?platform=${this.config.platform}`
      }).apply(compiler);
    }

    if (this.config.logger) {
      new _LoggerPlugin.LoggerPlugin({
        platform: this.config.platform,
        devServerEnabled: Boolean(this.config.devServer),
        output: {
          console: true,
          ...(typeof this.config.logger === 'object' ? this.config.logger : {})
        }
      }).apply(compiler);
    }
  }

}

exports.RepackPlugin = RepackPlugin;
//# sourceMappingURL=RepackPlugin.js.map