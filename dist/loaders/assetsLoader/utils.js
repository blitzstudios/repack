"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectScales = collectScales;
exports.getAssetDimensions = getAssetDimensions;
exports.getDefaultAsset = getDefaultAsset;
exports.getScaleNumber = getScaleNumber;
var _nodePath = _interopRequireDefault(require("node:path"));
var _imageSize = _interopRequireDefault(require("image-size"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function getScaleNumber(scaleKey) {
  return Number.parseFloat(scaleKey.replace(/[^\d.]/g, ''));
}

/** Default asset is the one with scale that was originally requested in the loader */
function getDefaultAsset(assets) {
  const defaultAsset = assets.find(asset => asset.default === true);
  if (!defaultAsset) {
    throw new Error('Malformed assets array - no default asset found');
  }
  return defaultAsset;
}
function getAssetDimensions({
  resourceData,
  resourceScale
}) {
  try {
    const info = (0, _imageSize.default)(resourceData);
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
async function collectScales(resourceAbsoluteDirname, resourceFilename, resourceExtension, scalableAssetExtensions, scalableAssetResolutions, readDirAsync) {
  if (!scalableAssetExtensions.includes(resourceExtension)) {
    return {
      '@1x': _nodePath.default.join(resourceAbsoluteDirname, resourceFilename + '.' + resourceExtension)
    };
  }

  // explicit scales
  const candidates = scalableAssetResolutions.map(scaleKey => {
    const scale = '@' + scaleKey + 'x';
    return [scale, resourceFilename + scale + '.' + resourceExtension];
  });
  // implicit 1x scale
  candidates.push(['@1x', resourceFilename + '.' + resourceExtension]);
  const contents = await readDirAsync(resourceAbsoluteDirname);
  const entries = new Set(contents);
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
//# sourceMappingURL=utils.js.map