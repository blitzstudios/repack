"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inlineAssets = inlineAssets;

var _dedent = _interopRequireDefault(require("dedent"));

var _mimeTypes = _interopRequireDefault(require("mime-types"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function inlineAssets({
  assets,
  resourcePath,
  resourceFilename,
  suffixPattern
}) {
  const mimeType = _mimeTypes.default.lookup(resourcePath) || undefined;
  const size = (0, _utils.getImageSize)({
    resourcePath,
    resourceFilename,
    suffixPattern
  });

  if (!mimeType) {
    throw new Error(`Cannot inline asset for request ${resourcePath} - unable to detect MIME type`);
  } // keys are always converted to strings


  const sourceSet = assets.reduce((sources, asset) => {
    sources[asset.scale] = encodeAsset(asset, mimeType, size);
    return sources;
  }, {});
  const scales = JSON.stringify(Object.keys(sourceSet).map(Number));
  /**
   * To enable scale resolution in runtime we need to import PixelRatio & AssetSourceResolver
   * Although we could use AssetSourceResolver as it is, we need to import PixelRatio to remain
   * compatible with older versions of React-Native. Newer versions of React-Native use
   * ESM for PixelRatio, so we need to check if PixelRatio is an ESM module and if so, adjust the import.
   */

  return (0, _dedent.default)`
    var PixelRatio = require('react-native/Libraries/Utilities/PixelRatio');
    var AssetSourceResolver = require('react-native/Libraries/Image/AssetSourceResolver');

    if (PixelRatio.__esModule) PixelRatio = PixelRatio.default;
    var prefferedScale = AssetSourceResolver.pickScale(${scales}, PixelRatio.get());

    module.exports = ${JSON.stringify(sourceSet)}[prefferedScale];
  `;
}

function encodeAsset(asset, mimeType, size) {
  const encodedContent = asset.content instanceof Buffer ? asset.content.toString('base64') : Buffer.from(asset.content ?? '').toString('base64');
  return {
    uri: `data:${mimeType};base64,${encodedContent}`,
    width: size === null || size === void 0 ? void 0 : size.width,
    height: size === null || size === void 0 ? void 0 : size.height,
    scale: asset.scale
  };
}
//# sourceMappingURL=inlineAssets.js.map