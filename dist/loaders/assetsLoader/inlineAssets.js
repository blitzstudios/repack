"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inlineAssets = inlineAssets;
var _dedent = _interopRequireDefault(require("dedent"));
var _mimeTypes = _interopRequireDefault(require("mime-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function inlineAssets({
  assets,
  resourcePath
}) {
  const mimeType = _mimeTypes.default.lookup(resourcePath) || undefined;
  if (!mimeType) {
    throw new Error(`Cannot inline asset for request ${resourcePath} - unable to detect MIME type`);
  }

  // keys are always converted to strings
  const sourceSet = assets.reduce((sources, {
    data,
    dimensions,
    scale
  }) => {
    sources[scale] = {
      uri: `data:${mimeType};base64,${data.toString('base64')}`,
      width: dimensions?.width,
      height: dimensions?.height,
      scale: scale
    };
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
//# sourceMappingURL=inlineAssets.js.map