"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractAssets = extractAssets;

var _path = _interopRequireDefault(require("path"));

var _dedent = _interopRequireDefault(require("dedent"));

var _hasha = _interopRequireDefault(require("hasha"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function extractAssets({
  resourcePath,
  resourceDirname,
  resourceFilename,
  resourceExtensionType,
  assets,
  suffixPattern,
  assetsDirname,
  pathSeparatorRegexp,
  publicPath: customPublicPath,
  devServerEnabled
}, logger) {
  let publicPath = _path.default.join(assetsDirname, resourceDirname).replace(pathSeparatorRegexp, '/');

  if (customPublicPath) {
    publicPath = _path.default.join(customPublicPath, publicPath);
  }

  const hashes = await Promise.all(assets.map(asset => {
    var _asset$content;

    return _hasha.default.async(((_asset$content = asset.content) === null || _asset$content === void 0 ? void 0 : _asset$content.toString()) ?? asset.filename, {
      algorithm: 'md5'
    });
  }));
  const size = (0, _utils.getImageSize)({
    resourceFilename,
    resourcePath,
    suffixPattern
  });
  logger.debug(`Extracted assets for request ${resourcePath}`, {
    hashes,
    publicPath: customPublicPath,
    height: size === null || size === void 0 ? void 0 : size.height,
    width: size === null || size === void 0 ? void 0 : size.width
  });
  return (0, _dedent.default)`
    var AssetRegistry = require('react-native/Libraries/Image/AssetRegistry');
    module.exports = AssetRegistry.registerAsset({
      __packager_asset: true,
      scales: ${JSON.stringify(assets.map(asset => asset.scale))},
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