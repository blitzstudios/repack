"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RepackPlugin = void 0;
var _BabelPlugin = require("./BabelPlugin.js");
var _DevelopmentPlugin = require("./DevelopmentPlugin.js");
var _LoggerPlugin = require("./LoggerPlugin.js");
var _NativeEntryPlugin = require("./NativeEntryPlugin.js");
var _index = require("./OutputPlugin/index.js");
var _index2 = require("./RepackTargetPlugin/index.js");
var _SourceMapPlugin = require("./SourceMapPlugin.js");
/**
 * {@link RepackPlugin} configuration options.
 */

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
 *   } = env;
 *
 *   return {
 *     plugins: [
 *       new Repack.RepackPlugin({
 *         platform,
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
 * import * as Repack from '@callstack/repack';
 *
 * new Repack.plugins.AssetsResolverPlugin();
 * ```
 *
 * @category Webpack Plugin
 */
class RepackPlugin {
  constructor(config = {}) {
    this.config = config;
    if (this.config.logger === undefined || this.config.logger === true) {
      this.config.logger = {};
    }
  }
  apply(__compiler) {
    const compiler = __compiler;
    const platform = this.config.platform ?? compiler.options.name;
    new compiler.webpack.DefinePlugin({
      __E2E__: JSON.stringify(process.env.E2E),
      __DEV__: JSON.stringify(compiler.options.mode === 'development')
    }).apply(compiler);
    new _BabelPlugin.BabelPlugin().apply(compiler);
    new _index.OutputPlugin({
      platform,
      enabled: !compiler.options.devServer,
      context: compiler.options.context,
      output: this.config.output ?? {},
      extraChunks: this.config.extraChunks
    }).apply(compiler);
    new _NativeEntryPlugin.NativeEntryPlugin({
      initializeCoreLocation: this.config.initializeCore
    }).apply(compiler);
    new _index2.RepackTargetPlugin().apply(compiler);
    new _DevelopmentPlugin.DevelopmentPlugin({
      platform,
      listenerIP: this.config?.listenerIP
    }).apply(compiler);
    new _SourceMapPlugin.SourceMapPlugin({
      platform
    }).apply(compiler);
    if (typeof this.config.logger === 'object') {
      new _LoggerPlugin.LoggerPlugin({
        output: {
          console: true,
          ...this.config.logger
        }
      }).apply(compiler);
    }
  }
}
exports.RepackPlugin = RepackPlugin;