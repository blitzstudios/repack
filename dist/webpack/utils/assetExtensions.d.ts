/** Extensions array of all scalable assets - images. */
export declare const SCALABLE_ASSETS: string[];
/** Extensions array of all supported assets by Re.Pack's Assets loader. */
export declare const NON_SCALABLE_ASSETS: string[];
/** Extensions array of all supported assets by Re.Pack's Assets loader. */
export declare const ASSET_EXTENSIONS: string[];
/**
 * Creates RegExp from array of asset extensions.
 *
 * @param extensions Extensions array.
 * @returns RegExp with extensions.
 *
 * @example Usage in Webpack config:
 * ```ts
 * import React from '@callstack/repack';
 *
 * export default () => {
 *   return {
 *     module: {
 *       rules: [{
 *         test: React.getAssetExtensionsRegExp(
 *           Repack.ASSET_EXTENSIONS.filter((ext) => ext !== 'svg')
 *         ),
 *         use: {
 *           loader: '@callstack/repack/assets-loader',
 *         }
 *       }],
 *     },
 *   };
 * };
 * ```
 */
export declare function getAssetExtensionsRegExp(extensions: string[]): RegExp;
