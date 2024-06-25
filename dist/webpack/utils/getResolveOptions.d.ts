/**
 * {@link getResolveOptions} additional options.
 */
export interface ResolveOptions {
    /**
     * Whether to enable Package Exports support. Defaults to `false`.
     */
    enablePackageExports?: boolean;
    /**
     * Whether to prefer native platform over generic platform. Defaults to `true`
     */
    preferNativePlatform?: boolean;
}
/**
 * Get Webpack's resolve options to properly resolve JavaScript files:
 * - resolve platform extensions (e.g. `file.ios.js`)
 * - resolve native extensions (e.g. `file.native.js`)
 * - optionally use package exports (`exports` field in `package.json`) instead of
 *   main fields (e.g. `main` or `browser` or `react-native`)
 *
 * @param platform Target application platform.
 * @param options Additional options that can modify resolution behaviour.
 * @returns Webpack's resolve options.
 *
 * @category Webpack util
 *
 * @example Usage in Webpack config:
 *
 * ```ts
 * import * as Repack from '@callstack/repack';
 *
 * export default (env) => {
 *   const { platform } = env;
 *
 *   return {
 *     resolve: {
 *       ...Repack.getResolveOptions(platform, {
 *         enablePackageExports: false,
 *         preferNativePlatform: true
 *       }),
 *     },
 *   };
 * };
 * ```
 */
export declare function getResolveOptions(platform: string, options?: ResolveOptions): {
    /**
     * Reference: Webpack's [configuration.resolve.mainFields](https://webpack.js.org/configuration/resolve/#resolvemainfields)
     */
    mainFields: string[];
    /**
     * Reference: Webpack's [configuration.resolve.aliasFields](https://webpack.js.org/configuration/resolve/#resolvealiasfields)
     */
    aliasFields: string[];
    /**
     * Reference: Webpack's [configuration.resolve.conditionNames](https://webpack.js.org/configuration/resolve/#resolveconditionnames)
     */
    conditionNames: string[];
    /**
     * Reference: Webpack's [configuration.resolve.exportsFields](https://webpack.js.org/configuration/resolve/#resolveexportsfields)
     */
    exportsFields: string[];
    /**
     * Reference: Webpack's [configuration.resolve.extensions](https://webpack.js.org/configuration/resolve/#resolveextensions)
     */
    extensions: string[];
};
