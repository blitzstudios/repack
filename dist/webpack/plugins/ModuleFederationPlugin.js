"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModuleFederationPlugin = void 0;

var _webpack = require("webpack");

var _federated = require("../federated");

/**
 * Webpack plugin to configure Module Federation with platform differences
 * handled under the hood.
 *
 * Usually, you should use `Repack.plugin.ModuleFederationPlugin`
 * instead of `webpack.container.ModuleFederationPlugin`.
 *
 * `Repack.plugin.ModuleFederationPlugin` creates:
 * - default for `filename` option when `exposes` is defined
 * - default for `library` option when `exposes` is defined
 * - default for `shared` option with `react` and `react-native` dependencies
 * - converts `remotes` into `ScriptManager`-powered `promise new Promise` loaders
 *
 * You can overwrite all defaults by passing respective options.
 *
 * `remotes` will always be converted to ScriptManager`-powered `promise new Promise` loaders
 * using {@link Federated.createRemote}.
 *
 * @example Host example.
 * ```js
 * import * as Repack from '@callstack/repack';
 *
 * new Repack.plugins.ModuleFederationPlugin({
 *   name: 'host,
 * });
 * ```
 *
 * @example Host example with additional `shared` dependencies.
 * ```js
 * import * as Repack from '@callstack/repack';
 *
 * new Repack.plugins.ModuleFederationPlugin({
 *   name: 'host,
 *   shared: {
 *     react: Repack.Federated.SHARED_REACT,
 *     'react-native': Repack.Federated.SHARED_REACT,
 *     'react-native-reanimated': {
 *       singleton: true,
 *     },
 *   },
 * });
 * ```
 *
 * @example Container examples.
 * ```js
 * import * as Repack from '@callstack/repack';
 *
 * new Repack.plugins.ModuleFederationPlugin({
 *   name: 'app1',
 *   remotes: {
 *     module1: 'module1@https://example.com/module1.container.bundle',
 *   },
 * });
 *
 * new Repack.plugins.ModuleFederationPlugin({
 *   name: 'app2',
 *   remotes: {
 *     module1: 'module1@https://example.com/module1.container.bundle',
 *     module2: 'module1@dynamic',
 *   },
 * });
 * ```
 *
 * @category Webpack Plugin
 */
class ModuleFederationPlugin {
  constructor(config) {
    this.config = config;
    this.config.reactNativeDeepImports = this.config.reactNativeDeepImports ?? true;
  }

  replaceRemotes(remote) {
    if (typeof remote === 'string') {
      return remote.startsWith('promise new Promise') ? remote : _federated.Federated.createRemote(remote);
    }

    if (Array.isArray(remote)) {
      return remote.map(remoteItem => this.replaceRemotes(remoteItem));
    }

    const replaced = {};

    for (const key in remote) {
      const value = remote[key];

      if (typeof value === 'string' || Array.isArray(value)) {
        replaced[key] = this.replaceRemotes(value);
      } else {
        replaced[key] = { ...value,
          external: this.replaceRemotes(value.external)
        };
      }
    }

    return replaced;
  }

  getDefaultSharedDependencies() {
    return {
      react: _federated.Federated.SHARED_REACT,
      'react-native': _federated.Federated.SHARED_REACT_NATIVE
    };
  }
  /**
   * As including 'react-native' as a shared dependency is not enough to support
   * deep imports from 'react-native' (e.g. 'react-native/Libraries/Utilities/PixelRatio'),
   * we need to add deep imports using an undocumented feature of ModuleFederationPlugin.
   *
   * When a dependency has a trailing slash, deep imports of that dependency will be correctly
   * resolved by reaching out to the shared scope. This also ensures single instances of things
   * like 'assetsRegistry'. Additionally, we mark every package from '@react-native' group as shared
   * as well, as these are used by React Native too.
   *
   * Reference: https://stackoverflow.com/questions/65636979/wp5-module-federation-sharing-deep-imports
   * Reference: https://github.com/webpack/webpack/blob/main/lib/sharing/resolveMatchedConfigs.js#L77-L79
   *
   * @param shared shared dependencies configuration from ModuleFederationPlugin
   * @returns adjusted shared dependencies configuration
   *
   * @internal
   */


  adaptSharedDependencies(shared) {
    const sharedDependencyConfig = eager => ({
      singleton: true,
      eager: eager ?? true,
      requiredVersion: '*'
    });

    const findSharedDependency = (name, dependencies) => {
      if (Array.isArray(dependencies)) {
        return dependencies.find(item => typeof item === 'string' ? item === name : Boolean(item[name]));
      } else {
        return dependencies[name];
      }
    };

    const sharedReactNative = findSharedDependency('react-native', shared);
    const reactNativeEager = typeof sharedReactNative === 'object' ? sharedReactNative.eager : undefined;

    if (!this.config.reactNativeDeepImports || !sharedReactNative) {
      return shared;
    }

    if (Array.isArray(shared)) {
      const adjustedSharedDependencies = [...shared];

      if (!findSharedDependency('react-native/', shared)) {
        adjustedSharedDependencies.push({
          'react-native/': sharedDependencyConfig(reactNativeEager)
        });
      }

      if (!findSharedDependency('@react-native/', shared)) {
        adjustedSharedDependencies.push({
          '@react-native/': sharedDependencyConfig(reactNativeEager)
        });
      }

      return adjustedSharedDependencies;
    } else {
      const adjustedSharedDependencies = { ...shared
      };

      if (!findSharedDependency('react-native/', shared)) {
        Object.assign(adjustedSharedDependencies, {
          'react-native/': sharedDependencyConfig(reactNativeEager)
        });
      }

      if (!findSharedDependency('@react-native/', shared)) {
        Object.assign(adjustedSharedDependencies, {
          '@react-native/': sharedDependencyConfig(reactNativeEager)
        });
      }

      return adjustedSharedDependencies;
    }
  }
  /**
   * Apply the plugin.
   *
   * @param compiler Webpack compiler instance.
   */


  apply(compiler) {
    const remotes = Array.isArray(this.config.remotes) ? this.config.remotes.map(remote => this.replaceRemotes(remote)) : this.replaceRemotes(this.config.remotes ?? {});
    const sharedDependencies = this.adaptSharedDependencies(this.config.shared ?? this.getDefaultSharedDependencies());
    new _webpack.container.ModuleFederationPlugin({
      exposes: this.config.exposes,
      filename: this.config.filename ?? this.config.exposes ? `${this.config.name}.container.bundle` : undefined,
      library: this.config.exposes ? {
        name: this.config.name,
        type: 'self',
        ...this.config.library
      } : undefined,
      name: this.config.name,
      shared: sharedDependencies,
      shareScope: this.config.shareScope,
      remotes,
      remoteType: this.config.remoteType,
      runtime: this.config.runtime
    }).apply(compiler);
  }

}

exports.ModuleFederationPlugin = ModuleFederationPlugin;
//# sourceMappingURL=ModuleFederationPlugin.js.map