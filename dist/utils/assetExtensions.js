"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SCALABLE_RESOLUTIONS = exports.SCALABLE_ASSETS = exports.NON_SCALABLE_ASSETS = exports.ASSET_EXTENSIONS = void 0;
exports.getAssetExtensionsRegExp = getAssetExtensionsRegExp;
/** Extensions array of all scalable assets - images. */
const SCALABLE_ASSETS = exports.SCALABLE_ASSETS = [
// Image formats
'bmp', 'gif', 'jpg', 'jpeg', 'png', 'psd', 'svg', 'webp', 'tiff'];

/** Resolutions array of all supported asset resolutions */
const SCALABLE_RESOLUTIONS = exports.SCALABLE_RESOLUTIONS = ['0.75', '1', '1.5', '2', '3', '4'];

/** Extensions array of all supported assets by Re.Pack's Assets loader. */
const NON_SCALABLE_ASSETS = exports.NON_SCALABLE_ASSETS = [
// Video formats
'm4v', 'mov', 'mp4', 'mpeg', 'mpg', 'webm',
// Audio formats
'aac', 'aiff', 'caf', 'm4a', 'mp3', 'wav',
// Document formats
'html', 'pdf', 'yaml', 'yml',
// Font formats
'otf', 'ttf',
// Other
'zip', 'obj'];

/** Extensions array of all supported assets by Re.Pack's Assets loader. */
const ASSET_EXTENSIONS = exports.ASSET_EXTENSIONS = [...SCALABLE_ASSETS, ...NON_SCALABLE_ASSETS];

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
function getAssetExtensionsRegExp(extensions = ASSET_EXTENSIONS) {
  return new RegExp(`\\.(${extensions.join('|')})$`);
}
//# sourceMappingURL=assetExtensions.js.map