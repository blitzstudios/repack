"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToRemoteAssets = convertToRemoteAssets;
var _nodePath = _interopRequireDefault(require("node:path"));
var _dedent = _interopRequireDefault(require("dedent"));
var _utils = require("./utils.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function convertToRemoteAssets({
  assets,
  assetsDirname,
  remotePublicPath,
  resourceDirname,
  resourceExtensionType,
  resourceFilename,
  pathSeparatorRegexp
}) {
  const assetPath = _nodePath.default.join(assetsDirname, resourceDirname).replace(pathSeparatorRegexp, '/');

  // works on both unix & windows
  const publicPathURL = new URL(_nodePath.default.join(remotePublicPath, assetPath));
  const size = (0, _utils.getAssetSize)(assets);
  const asset = JSON.stringify({
    name: resourceFilename,
    type: resourceExtensionType,
    httpServerLocation: publicPathURL.href,
    scales: assets.map(asset => asset.scale),
    height: size?.height,
    width: size?.width
  });
  return (0, _dedent.default)`
    var AssetSourceResolver = require('react-native/Libraries/Image/AssetSourceResolver');
    if ('default' in AssetSourceResolver) AssetSourceResolver = AssetSourceResolver.default;
    var resolver = new AssetSourceResolver(undefined, undefined, ${asset});

    module.exports = resolver.scaledAssetPath();
  `;
}
//# sourceMappingURL=convertToRemoteAssets.js.map