"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractAssets = extractAssets;
var _nodeCrypto = _interopRequireDefault(require("node:crypto"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _dedent = _interopRequireDefault(require("dedent"));
var _utils = require("./utils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function extractAssets({
  resourcePath,
  resourceDirname,
  resourceFilename,
  resourceExtensionType,
  assets,
  assetsDirname,
  pathSeparatorRegexp,
  publicPath: customPublicPath,
  devServerEnabled
}, logger) {
  let publicPath = _nodePath.default.join(assetsDirname, resourceDirname).replace(pathSeparatorRegexp, '/');
  if (customPublicPath) {
    publicPath = _nodePath.default.join(customPublicPath, publicPath);
  }
  const size = (0, _utils.getDefaultAsset)(assets).dimensions;
  const scales = assets.map(asset => asset.scale);
  const hashes = assets.map(asset => _nodeCrypto.default.createHash('md5').update(asset.data).digest('hex'));
  logger.debug(`Extracted assets for request ${resourcePath}`, JSON.stringify({
    hashes,
    publicPath: customPublicPath,
    height: size?.height,
    width: size?.width
  }));
  return (0, _dedent.default)`
    var AssetRegistry = require('react-native/Libraries/Image/AssetRegistry');
    module.exports = AssetRegistry.registerAsset({
      __packager_asset: true,
      scales: ${JSON.stringify(scales)},
      name: ${JSON.stringify(resourceFilename)},
      type: ${JSON.stringify(resourceExtensionType)},
      hash: ${JSON.stringify(hashes.join())},
      httpServerLocation: ${JSON.stringify(publicPath)},
      ${devServerEnabled ? `fileSystemLocation: ${JSON.stringify(resourceDirname)},` : ''}
      ${size ? `height: ${size.height},` : ''}
      ${size ? `width: ${size.width},` : ''}
    });
    `;
}
//# sourceMappingURL=extractAssets.js.map