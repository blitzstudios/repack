"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DevelopmentPlugin = void 0;
var _nodePath = _interopRequireDefault(require("node:path"));
var _pluginReactRefresh = _interopRequireDefault(require("@rspack/plugin-react-refresh"));
var _isRspackCompiler = require("./utils/isRspackCompiler");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const [reactRefreshEntryPath, reactRefreshPath, refreshUtilsPath] = _pluginReactRefresh.default.deprecated_runtimePaths;

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
      __PUBLIC_PROTOCOL__: this.config.devServer.https ? '"https"' : '"http"',
      __PUBLIC_HOST__: JSON.stringify(this.config.devServer.host),
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

      // setup HMR source maps
      new compiler.webpack.SourceMapDevToolPlugin({
        test: /\.hot-update\.js$/,
        filename: '[file].map',
        append: `//# sourceMappingURL=[url]?platform=${this.config.platform}`,
        module: true,
        columns: true,
        noSources: false,
        namespace: compiler.options.output.devtoolNamespace ?? compiler.options.output.uniqueName
      }).apply(compiler);

      // setup React Refresh manually instead of using the official plugin
      // to avoid issues with placement of reactRefreshEntry
      new compiler.webpack.ProvidePlugin({
        $ReactRefreshRuntime$: reactRefreshPath
      }).apply(compiler);
      new compiler.webpack.DefinePlugin({
        __react_refresh_error_overlay__: false,
        __react_refresh_socket__: false,
        __react_refresh_library__: JSON.stringify(compiler.webpack.Template.toIdentifier(compiler.options.output.uniqueName || compiler.options.output.library))
      }).apply(compiler);
      new compiler.webpack.ProvidePlugin({
        __react_refresh_utils__: refreshUtilsPath
      });
      const refreshPath = _nodePath.default.dirname(require.resolve('react-refresh'));
      compiler.options.resolve.alias = {
        'react-refresh': refreshPath,
        ...compiler.options.resolve.alias
      };
      compiler.options.module.rules.unshift({
        include: /\.([cm]js|[jt]sx?|flow)$/i,
        exclude: /node_modules/i,
        use: 'builtin:react-refresh-loader'
      });
      const devEntries = [reactRefreshEntryPath, require.resolve('../modules/configurePublicPath'), require.resolve('../modules/WebpackHMRClient')];

      // TODO (jbroma): refactor this to be more maintainable
      // This is a very hacky way to reorder entrypoints, and needs to be done differently
      // depending on the compiler type (rspack/webpack)
      if ((0, _isRspackCompiler.isRspackCompiler)(compiler)) {
        // Add entries after the rspack MF entry is added during `hook.afterPlugins` stage
        compiler.hooks.initialize.tap({
          name: 'DevelopmentPlugin',
          stage: 200
        }, () => {
          for (const entry of devEntries) {
            new compiler.webpack.EntryPlugin(compiler.context, entry, {
              name: undefined
            }).apply(compiler);
          }
        });
      } else {
        if (!this.config.entryName) {
          // Add dev entries as global entries
          for (const entry of devEntries) {
            new compiler.webpack.EntryPlugin(compiler.context, entry, {
              name: undefined
            }).apply(compiler);
          }
        } else {
          if (typeof compiler.options.entry === 'function') {
            // TODO (jbroma): Support function entry points?
            throw new Error('DevelopmentPlugin is not compatible with function entry points');
          }
          const entries = compiler.options.entry[this.config.entryName].import ?? [];
          const scriptManagerEntryIndex = entries.findIndex(entry => entry.includes('InitializeScriptManager'));
          if (scriptManagerEntryIndex !== -1) {
            // Insert devEntries after 'InitializeScriptManager'
            compiler.options.entry[this.config.entryName].import = [...entries.slice(0, scriptManagerEntryIndex + 1), ...devEntries, ...entries.slice(scriptManagerEntryIndex + 1)];
          } else {
            // 'InitializeScriptManager' entry not found, insert devEntries before the normal entries
            compiler.options.entry[this.config.entryName].import = [...devEntries, ...entries];
          }
        }
      }
    }
  }
}
exports.DevelopmentPlugin = DevelopmentPlugin;
//# sourceMappingURL=DevelopmentPlugin.js.map