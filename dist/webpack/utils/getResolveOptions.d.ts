/**
 * Get Webpack's resolve options to properly resolve JavaScript files
 * that contain `<platform>` or `native` (eg `file.ios.js`) suffixes as well as `react-native` field
 * in dependencies' `package.json`.
 *
 * @param platform Target application platform.
 * @returns Webpack's resolve options.
 *
 * @category Webpack util
 *
 * @example Usage in Webpack config:
 * ```ts
 * import * as Repack from '@callstack/repack';
 *
 * export default (env) => {
 *   const { platform } = env;
 *
 *   return {
 *     resolve: {
 *       ...Repack.getResolveOptions(platform),
 *     },
 *   };
 * };
 * ```
 */
export declare function getResolveOptions(platform: string): {
    /**
     * Match what React Native packager supports.
     * First entry takes precedence.
     */
    mainFields: string[];
    aliasFields: string[];
    conditionNames: string[];
    extensions: string[];
};
