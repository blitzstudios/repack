"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RepackPlugin = void 0;
var _DevelopmentPlugin = require("./DevelopmentPlugin");
var _LoggerPlugin = require("./LoggerPlugin");
var _NativeEntryPlugin = require("./NativeEntryPlugin");
var _OutputPlugin = require("./OutputPlugin");
var _RepackTargetPlugin = require("./RepackTargetPlugin");
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
 * import * as Repack from '@callstack/repack';
 *
 * new Repack.plugins.AssetsResolverPlugin();
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
    let entryName = this.config.entryName;
    if (!entryName && typeof compiler.options.entry !== 'function') {
      // 'main' is the default name for the entry chunk
      if ('main' in compiler.options.entry) {
        entryName = 'main';
      }
    }
    new compiler.webpack.DefinePlugin({
      __DEV__: JSON.stringify(this.config.mode === 'development'),
      __E2E__: JSON.stringify(process.env.E2E)
    }).apply(compiler);
    new _OutputPlugin.OutputPlugin({
      platform: this.config.platform,
      enabled: !this.config.devServer && !!entryName,
      context: this.config.context,
      output: this.config.output,
      entryName: this.config.entryName,
      extraChunks: this.config.extraChunks
    }).apply(compiler);
    if (entryName) {
      new _NativeEntryPlugin.NativeEntryPlugin({
        entryName,
        initializeCoreLocation: this.config.initializeCore
      }).apply(compiler);
    }
    new _RepackTargetPlugin.RepackTargetPlugin({
      hmr: this.config.devServer?.hmr
    }).apply(compiler);
    new _DevelopmentPlugin.DevelopmentPlugin({
      platform: this.config.platform,
      devServer: this.config.devServer,
      listenerIP: this.config?.listenerIP
    }).apply(compiler);
    if (this.config.sourceMaps) {
      new compiler.webpack.SourceMapDevToolPlugin({
        test: /\.(js)?bundle$/,
        filename: '[file].map',
        append: `//# sourceMappingURL=[url]?platform=${this.config.platform}`,
        module: true,
        columns: true,
        noSources: false
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