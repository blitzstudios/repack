"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DevelopmentPlugin = void 0;
var _nodePath = _interopRequireDefault(require("node:path"));
var _pluginReactRefresh = _interopRequireDefault(require("@rspack/plugin-react-refresh"));
var _isRspackCompiler = require("./utils/isRspackCompiler.js");
var _moveElementBefore = require("./utils/moveElementBefore.js");
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
  getEntryNormalizedEntryChunks(entryNormalized) {
    if (typeof entryNormalized === 'function') {
      throw new Error('[RepackDevelopmentPlugin] Dynamic entry (function) is not supported.');
    }
    return Object.keys(entryNormalized).map(name => entryNormalized[name].runtime || name);
  }
  getModuleFederationEntryChunks(plugins) {
    const entrypoints = plugins.map(plugin => {
      if (typeof plugin !== 'object' || !plugin) {
        return;
      }
      if (!plugin.constructor?.name.startsWith('ModuleFederationPlugin')) {
        return;
      }

      // repack MF plugins expose config property
      if ('config' in plugin && !!plugin.config.exposes) {
        return plugin.config.name;
      }

      // official MF plugins expose _options property
      if ('_options' in plugin && !!plugin.config.exposes) {
        return plugin._options.name;
      }
      return;
    });
    return entrypoints.filter(Boolean);
  }
  getProtocolType(devServer) {
    if (typeof devServer.server === 'string') {
      return devServer.server;
    }
    if (typeof devServer.server?.type === 'string') {
      return devServer.server.type;
    }
    return 'http';
  }

  /**
   * Apply the plugin.
   *
   * @param compiler Webpack compiler instance.
   */
  apply(compiler) {
    if (!compiler.options.devServer) {
      return;
    }
    const reactNativePackageJson = require('react-native/package.json');
    const [majorVersion, minorVersion, patchVersion] = reactNativePackageJson.version.split('-')[0].split('.');
    const host = compiler.options.devServer.host;
    const port = compiler.options.devServer.port;
    const protocol = this.getProtocolType(compiler.options.devServer);
    const platform = this.config.platform ?? compiler.options.name;
    new compiler.webpack.DefinePlugin({
      __PLATFORM__: JSON.stringify(platform),
      __PUBLIC_PROTOCOL__: JSON.stringify(protocol),
      __PUBLIC_HOST__: JSON.stringify(host),
      __PUBLIC_PORT__: Number(port),
      __LISTENER_IP__: JSON.stringify(this.config.listenerIP),
      __REACT_NATIVE_MAJOR_VERSION__: Number(majorVersion),
      __REACT_NATIVE_MINOR_VERSION__: Number(minorVersion),
      __REACT_NATIVE_PATCH_VERSION__: Number(patchVersion)
    }).apply(compiler);
    if (compiler.options.devServer.hot) {
      // setup HMR
      new compiler.webpack.HotModuleReplacementPlugin().apply(compiler);

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
      }).apply(compiler);
      const refreshPath = _nodePath.default.dirname(require.resolve('react-refresh'));
      compiler.options.resolve.alias = {
        'react-refresh': refreshPath,
        ...compiler.options.resolve.alias
      };
      compiler.options.module.rules.unshift({
        include: /\.([cm]js|[jt]sx?|flow)$/i,
        exclude: /node_modules/i,
        use: '@callstack/repack/react-refresh-loader'
      });
      const devEntries = [reactRefreshEntryPath, require.resolve('../modules/configurePublicPath.js'), require.resolve('../modules/WebpackHMRClient.js')];
      compiler.hooks.entryOption.tap({
        name: 'RepackDevelopmentPlugin'
      }, (_, entryNormalized) => {
        // combine entries for all declared and MF entrypoints
        const entrypoints = [...this.getEntryNormalizedEntryChunks(entryNormalized), ...this.getModuleFederationEntryChunks(compiler.options.plugins)];

        // add development entries to all combined entrypoints
        entrypoints.forEach(entryName => {
          for (const devEntry of devEntries) {
            new compiler.webpack.EntryPlugin(compiler.context, devEntry, {
              name: entryName
            }).apply(compiler);
          }
        });
      });
      if (!(0, _isRspackCompiler.isRspackCompiler)(compiler)) {
        // In Webpack, Module Federation Container entry gets injected during the compilation's make phase,
        // similar to how dynamic entries work. This means the federation entry is added after our development entries.
        // We need to reorder dependencies to ensure federation entry is placed before development entries.
        compiler.hooks.make.tap({
          name: 'RepackDevelopmentPlugin',
          stage: 1000
        }, compilation => {
          for (const entry of compilation.entries.values()) {
            (0, _moveElementBefore.moveElementBefore)(entry.dependencies, {
              elementToMove: /\.federation\/entry/,
              beforeElement: devEntries[0],
              getElement: dependency => dependency.request ?? ''
            });
          }
        });
      }
    }
  }
}
exports.DevelopmentPlugin = DevelopmentPlugin;
//# sourceMappingURL=DevelopmentPlugin.js.map