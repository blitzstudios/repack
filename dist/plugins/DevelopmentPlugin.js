"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DevelopmentPlugin = void 0;
var _pluginReactRefresh = _interopRequireDefault(require("@rspack/plugin-react-refresh"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * {@link DevelopmentPlugin} configuration options.
 */

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
    if (!this.config?.devServer) {
      return;
    }
    const reactNativePackageJson = require('react-native/package.json');
    const [majorVersion, minorVersion, patchVersion] = reactNativePackageJson.version.split('-')[0].split('.');
    new compiler.webpack.DefinePlugin({
      __PLATFORM__: JSON.stringify(this.config.platform),
      __PUBLIC_PORT__: Number(this.config.devServer.port),
      __LISTENER_IP__: JSON.stringify(this.config.listenerIP),
      __REACT_NATIVE_MAJOR_VERSION__: Number(majorVersion),
      __REACT_NATIVE_MINOR_VERSION__: Number(minorVersion),
      __REACT_NATIVE_PATCH_VERSION__: Number(patchVersion)
    }).apply(compiler);

    // Enforce output filenames in development mode
    compiler.options.output.filename = pathData => pathData.chunk?.name === 'main' ? 'index.bundle' : '[name].bundle';
    compiler.options.output.chunkFilename = '[name].chunk.bundle';
    if (this.config?.devServer.hmr) {
      // setup HMR
      new compiler.webpack.HotModuleReplacementPlugin().apply(compiler);

      // add react-refresh-loader fallback for compatibility with Webpack
      compiler.options.resolveLoader = {
        ...compiler.options.resolveLoader,
        fallback: {
          ...compiler.options.resolveLoader?.fallback,
          'builtin:react-refresh-loader': require.resolve('../loaders/reactRefreshCompatLoader')
        }
      };
      new _pluginReactRefresh.default({
        overlay: false
      }).apply(compiler);
      new compiler.webpack.EntryPlugin(compiler.context, require.resolve('../modules/configurePublicPath'), {
        name: undefined
      }).apply(compiler);
      new compiler.webpack.EntryPlugin(compiler.context, require.resolve('../modules/WebpackHMRClient'), {
        name: undefined
      }).apply(compiler);

      // setup HMR source maps
      new compiler.webpack.SourceMapDevToolPlugin({
        test: /\.hot-update\.js$/,
        filename: '[file].map',
        append: `//# sourceMappingURL=[url]?platform=${this.config.platform}`,
        module: true,
        columns: true,
        noSources: false
      }).apply(compiler);
    }
  }
}
exports.DevelopmentPlugin = DevelopmentPlugin;
//# sourceMappingURL=DevelopmentPlugin.js.map