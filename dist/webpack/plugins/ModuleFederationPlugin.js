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
  /**
   * Apply the plugin.
   *
   * @param compiler Webpack compiler instance.
   */


  apply(compiler) {
    const remotes = Array.isArray(this.config.remotes) ? this.config.remotes.map(remote => this.replaceRemotes(remote)) : this.replaceRemotes(this.config.remotes ?? {});
    new _webpack.container.ModuleFederationPlugin({ ...this.config,
      filename: this.config.filename ?? this.config.exposes ? `${this.config.name}.container.bundle` : undefined,
      library: this.config.exposes ? {
        name: this.config.name,
        type: 'self',
        ...this.config.library
      } : undefined,
      shared: this.config.shared ?? {
        react: _federated.Federated.SHARED_REACT,
        'react-native': _federated.Federated.SHARED_REACT_NATIVE
      },
      remotes
    }).apply(compiler);
  }

}

exports.ModuleFederationPlugin = ModuleFederationPlugin;
//# sourceMappingURL=ModuleFederationPlugin.js.map