"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SCALABLE_ASSETS = exports.NON_SCALABLE_ASSETS = exports.ASSET_EXTENSIONS = void 0;
exports.getAssetExtensionsRegExp = getAssetExtensionsRegExp;

/** Extensions array of all scalable assets - images. */
const SCALABLE_ASSETS = [// Image formats
'bmp', 'gif', 'jpg', 'jpeg', 'png', 'psd', 'svg', 'webp', 'tiff'];
/** Extensions array of all supported assets by Re.Pack's Assets loader. */

exports.SCALABLE_ASSETS = SCALABLE_ASSETS;
const NON_SCALABLE_ASSETS = [// Video formats
'm4v', 'mov', 'mp4', 'mpeg', 'mpg', 'webm', // Audio formats
'aac', 'aiff', 'caf', 'm4a', 'mp3', 'wav', // Document formats
'html', 'pdf', 'yaml', 'yml', // Font formats
'otf', 'ttf', // Other
'zip', 'obj'];
/** Extensions array of all supported assets by Re.Pack's Assets loader. */

exports.NON_SCALABLE_ASSETS = NON_SCALABLE_ASSETS;
const ASSET_EXTENSIONS = [...SCALABLE_ASSETS, ...NON_SCALABLE_ASSETS];
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

exports.ASSET_EXTENSIONS = ASSET_EXTENSIONS;

function getAssetExtensionsRegExp(extensions) {
  return new RegExp(`\\.(${extensions.join('|')})$`);
}
//# sourceMappingURL=assetExtensions.js.map