"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inlineAssets = inlineAssets;

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
    throw new Error(`Cannot inline asset for request ${resourcePath} - unable to detect mime type`);
  }

  const sourceSet = assets.map(asset => encodeAsset(asset, mimeType, size));
  return `module.exports = ${JSON.stringify(sourceSet.length === 1 ? sourceSet[0] : sourceSet)}`;
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