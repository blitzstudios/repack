/** Extensions array of all scalable assets - images. */
export declare const SCALABLE_ASSETS: string[];
/** Extensions array of all supported assets by Re.Pack's Assets loader. */
export declare const ASSET_EXTENSIONS: string[];
/**
 * Creates RegExp from array of asset extensions.
 *
 * @param extensions Extensions array.
 * @returns RegExp with extensions.
 */
export declare function getAssetExtensionsRegExp(extensions: string[]): RegExp;
