import type { Compiler, RspackPluginInstance, container } from '@rspack/core';
type MFPluginV1 = typeof container.ModuleFederationPluginV1;
type MFPluginV1Options = ConstructorParameters<MFPluginV1>[0];
/**
 * {@link ModuleFederationPlugin} configuration options.
 *
 * The fields and types are exactly the same as in `webpack.container.ModuleFederationPlugin`.
 *
 * You can check documentation for all supported options here: https://webpack.js.org/plugins/module-federation-plugin/
 */
export interface ModuleFederationPluginV1Config extends MFPluginV1Options {
    /** Enable or disable adding React Native deep imports to shared dependencies */
    reactNativeDeepImports?: boolean;
}
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
export declare class ModuleFederationPluginV1 implements RspackPluginInstance {
    private config;
    private deepImports;
    constructor(pluginConfig: ModuleFederationPluginV1Config);
    /**
     * This method provides compatibility between webpack and Rspack for the ModuleFederation plugin.
     * In Rspack, Module Federation 1.5 is implemented under the name that's used in webpack for the original version.
     * This method adjusts for this naming difference to ensure we use the correct plugin version.
     *
     * @param compiler - The compiler instance (either webpack or Rspack)
     * @returns The appropriate ModuleFederationPlugin class
     */
    private getModuleFederationPlugin;
    private replaceRemotes;
    private getDefaultSharedDependencies;
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
    private adaptSharedDependencies;
    /**
     * Apply the plugin.
     *
     * @param compiler Webpack compiler instance.
     */
    apply(compiler: Compiler): void;
}
export {};
