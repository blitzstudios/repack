"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToRemoteAssets = convertToRemoteAssets;

var _path = _interopRequireDefault(require("path"));

var _dedent = _interopRequireDefault(require("dedent"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertToRemoteAssets({
  assets,
  assetsDirname,
  remotePublicPath,
  resourceDirname,
  resourceExtensionType,
  resourceFilename,
  resourcePath,
  suffixPattern,
  pathSeparatorRegexp
}) {
  const assetPath = _path.default.join(assetsDirname, resourceDirname).replace(pathSeparatorRegexp, '/'); // works on both unix & windows


  const publicPathURL = new URL(_path.default.join(remotePublicPath, assetPath));
  const size = (0, _utils.getImageSize)({
    resourcePath,
    resourceFilename,
    suffixPattern
  });
  const asset = JSON.stringify({
    name: resourceFilename,
    type: resourceExtensionType,
    httpServerLocation: publicPathURL.href,
    scales: assets.map(asset => asset.scale),
    height: size === null || size === void 0 ? void 0 : size.height,
    width: size === null || size === void 0 ? void 0 : size.width
  });
  return (0, _dedent.default)`
    var AssetSourceResolver = require('react-native/Libraries/Image/AssetSourceResolver');
    var resolver = new AssetSourceResolver(undefined, undefined, ${asset});

    module.exports = resolver.scaledAssetPath();
  `;
}
//# sourceMappingURL=convertToRemoteAssets.js.map