"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectScales = collectScales;
exports.getAssetDimensions = getAssetDimensions;
exports.getAssetSize = getAssetSize;
exports.getScaleNumber = getScaleNumber;
var _nodePath = _interopRequireDefault(require("node:path"));
var _imageSize = require("image-size");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function getScaleNumber(scaleKey) {
  return Number.parseFloat(scaleKey.replace(/[^\d.]/g, ''));
}
function getAssetSize(assets) {
  // Use first asset for reference as size, just like in metro:
  // https://github.com/facebook/metro/blob/main/packages/metro/src/Assets.js#L223
  return assets[0].dimensions;
}
function getAssetDimensions({
  resourceData,
  resourceScale
}) {
  try {
    const info = (0, _imageSize.imageSize)(resourceData);
    if (!info.width || !info.height) {
      return null;
    }
    return {
      width: info.width / resourceScale,
      height: info.height / resourceScale
    };
  } catch {
    return null;
  }
}
async function collectScales(resourceAbsoluteDirname, resourceFilename, resourceExtension, scalableAssetExtensions, scalableAssetResolutions, platform, readDirAsync) {
  // implicit 1x scale
  let candidates = [['@1x', resourceFilename + '.' + resourceExtension], ['@1x', resourceFilename + '.' + platform + '.' + resourceExtension]];

  // explicit scales
  if (scalableAssetExtensions.includes(resourceExtension)) {
    candidates = candidates.concat(scalableAssetResolutions.flatMap(scaleKey => {
      const scale = '@' + scaleKey + 'x';
      return [[scale, resourceFilename + scale + '.' + resourceExtension], [scale, resourceFilename + scale + '.' + platform + '.' + resourceExtension]];
    }));
  }
  const contents = await readDirAsync(resourceAbsoluteDirname);
  const entries = new Set(contents);

  // assets with platform extensions are more specific and take precedence
  const collectedScales = {};
  for (const candidate of candidates) {
    const [scaleKey, candidateFilename] = candidate;
    if (entries.has(candidateFilename)) {
      const filepath = _nodePath.default.join(resourceAbsoluteDirname, candidateFilename);
      collectedScales[scaleKey] = filepath;
    }
  }
  return collectedScales;
}