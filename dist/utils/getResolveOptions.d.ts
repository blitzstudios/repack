interface GetResolveOptionsResult {
    mainFields: string[];
    aliasFields: string[];
    conditionNames: string[];
    exportsFields: string[];
    extensions: string[];
    extensionAlias: Record<string, string[]>;
    importsFields: string[];
}
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
export declare function getResolveOptions(options?: ResolveOptions): GetResolveOptionsResult;
export declare function getResolveOptions(platform: string, options?: ResolveOptions): GetResolveOptionsResult;
export {};
