import type { moduleFederationPlugin as MF } from '@module-federation/sdk';
import type { Compiler, RspackPluginInstance } from '@rspack/core';
/**
 * {@link ModuleFederationPlugin} configuration options.
 *
 * The fields and types are exactly the same as in the official `ModuleFederationPlugin`.
 *
 * You can check documentation for all supported options here: https://module-federation.io/configure/
 */
export interface ModuleFederationPluginV2Config extends MF.ModuleFederationPluginOptions {
    /** Enable or disable adding React Native deep imports to shared dependencies. Defaults to true */
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
export declare class ModuleFederationPluginV2 implements RspackPluginInstance {
    private config;
    private deepImports;
    constructor(pluginConfig: ModuleFederationPluginV2Config);
    private ensureModuleFederationPackageInstalled;
    private adaptRuntimePlugins;
    private getModuleFederationPlugin;
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
    apply(compiler: Compiler): void;
}
