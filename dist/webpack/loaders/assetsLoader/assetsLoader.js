"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = repackAssetsLoader;
exports.raw = void 0;

var _path = _interopRequireDefault(require("path"));

var _AssetResolver = require("../../plugins/AssetsResolverPlugin/AssetResolver");

var _options = require("./options");

var _extractAssets = require("./extractAssets");

var _inlineAssets = require("./inlineAssets");

var _convertToRemoteAssets = require("./convertToRemoteAssets");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const raw = true;
exports.raw = raw;
const testXml = /\.(xml)$/;
const testMP4 = /\.(mp4)$/;
const testImages = /\.(png|jpg|gif|webp)$/;
const testFonts = /\.(ttf|otf|ttc)$/;

async function repackAssetsLoader() {
  this.cacheable();
  const callback = this.async();
  const logger = this.getLogger('repackAssetsLoader');
  const rootContext = this.rootContext;
  logger.debug(`Processing asset ${this.resourcePath}`);

  try {
    const options = (0, _options.getOptions)(this);
    const pathSeparatorRegexp = new RegExp(`\\${_path.default.sep}`, 'g');
    const resourcePath = this.resourcePath;

    const resourceAbsoluteDirname = _path.default.dirname(resourcePath); // Relative path to rootContext without any ../ due to https://github.com/callstack/haul/issues/474
    // Assets from from outside of rootContext, should still be placed inside bundle output directory.
    // Example:
    //   resourcePath    = <abs>/monorepo/node_modules/my-module/image.png
    //   dirname         = <abs>/monorepo/node_modules/my-module
    //   rootContext     = <abs>/monorepo/packages/my-app/
    //   resourceDirname = ../../node_modules/my-module (original)
    // So when we calculate destination for the asset for iOS (assetsDirname + resourceDirname + filename),
    // it will end up outside of `assets` directory, so we have to make sure it's:
    //   resourceDirname = node_modules/my-module (tweaked)


    const resourceDirname = _path.default.relative(rootContext, resourceAbsoluteDirname).replace(new RegExp(`^[\\.\\${_path.default.sep}]+`), '');

    const resourceExtensionType = _path.default.extname(resourcePath).replace(/^\./, '');

    const suffixPattern = `(@\\d+(\\.\\d+)?x)?(\\.(${options.platform}|native))?\\.${resourceExtensionType}$`;

    const resourceFilename = _path.default.basename(resourcePath).replace(new RegExp(suffixPattern), ''); // Name with embedded resourceDirname eg `node_modules_reactnative_libraries_newappscreen_components_logo.png`


    const resourceNormalizedFilename = `${(resourceDirname.length === 0 ? resourceFilename : `${resourceDirname.replace(pathSeparatorRegexp, '_')}_${resourceFilename}`).toLowerCase().replace(/[^a-z0-9_]/g, '')}.${resourceExtensionType}`;
    const assetsDirname = 'assets';
    const remoteAssetsDirname = 'remote-assets';
    const files = await (0, _utils.getFilesInDirectory)(resourceAbsoluteDirname, this.fs);

    const scales = _AssetResolver.AssetResolver.collectScales(options.scalableAssetExtensions, files, {
      name: resourceFilename,
      type: resourceExtensionType,
      platform: options.platform
    });

    const scaleKeys = Object.keys(scales).sort((a, b) => (0, _utils.getScaleNumber)(a) - (0, _utils.getScaleNumber)(b));

    for (const scaleKey of scaleKeys) {
      const filenameWithScale = _path.default.join(resourceAbsoluteDirname, scales[scaleKey].name);

      this.addDependency(filenameWithScale);
    }

    const assets = await Promise.all(scaleKeys.map(async scaleKey => {
      var _options$remote;

      const filenameWithScale = _path.default.join(resourceAbsoluteDirname, scales[scaleKey].name);

      const content = await (0, _utils.readFile)(filenameWithScale, this.fs);
      let destination;

      if (!options.devServerEnabled && !((_options$remote = options.remote) !== null && _options$remote !== void 0 && _options$remote.enabled) && options.platform === 'android') {
        // found font family
        if (testXml.test(resourceNormalizedFilename) && (content === null || content === void 0 ? void 0 : content.indexOf('font-family')) !== -1) {
          destination = 'font';
        } else if (testFonts.test(resourceNormalizedFilename)) {
          // font extensions
          destination = 'font';
        } else if (testMP4.test(resourceNormalizedFilename)) {
          // video files extensions
          destination = 'raw';
        } else if (testImages.test(resourceNormalizedFilename) || testXml.test(resourceNormalizedFilename)) {
          // images extensions
          switch (scaleKey) {
            case '@0.75x':
              destination = 'drawable-ldpi';
              break;

            case '@1x':
              destination = 'drawable-mdpi';
              break;

            case '@1.5x':
              destination = 'drawable-hdpi';
              break;

            case '@2x':
              destination = 'drawable-xhdpi';
              break;

            case '@3x':
              destination = 'drawable-xxhdpi';
              break;

            case '@4x':
              destination = 'drawable-xxxhdpi';
              break;

            default:
              throw new Error(`Unknown scale ${scaleKey} for ${filenameWithScale}`);
          }
        } else {
          // everything else is going to RAW
          destination = 'raw';
        }

        destination = _path.default.join(destination, resourceNormalizedFilename);
      } else {
        var _options$remote2;

        const name = `${resourceFilename}${scaleKey === '@1x' ? '' : scaleKey}.${resourceExtensionType}`;
        destination = _path.default.join((_options$remote2 = options.remote) !== null && _options$remote2 !== void 0 && _options$remote2.enabled ? remoteAssetsDirname : '', assetsDirname, resourceDirname, name);
      }

      return {
        filename: destination,
        content,
        scaleKey,
        scale: (0, _utils.getScaleNumber)(scaleKey)
      };
    }));
    logger.debug(`Resolved request ${this.resourcePath}`, {
      platform: options.platform,
      rootContext,
      resourceNormalizedFilename,
      resourceFilename,
      resourceDirname,
      resourceAbsoluteDirname,
      resourceExtensionType,
      scales,
      assets: assets.map(asset => {
        var _asset$content;

        return { ...asset,
          content: `size=${(_asset$content = asset.content) === null || _asset$content === void 0 ? void 0 : _asset$content.length} type=${typeof asset.content}`
        };
      })
    });

    if (options.inline) {
      logger.debug(`Inlining assets for request ${resourcePath}`);
      callback === null || callback === void 0 ? void 0 : callback(null, (0, _inlineAssets.inlineAssets)({
        assets,
        resourcePath,
        resourceFilename,
        suffixPattern
      }));
    } else {
      var _options$remote3;

      for (const asset of assets) {
        const {
          filename,
          content
        } = asset;
        logger.debug(`Emitting asset ${filename} for request ${resourcePath}`); // Assets are emitted relatively to `output.path`.

        this.emitFile(filename, content ?? '');
      }

      if ((_options$remote3 = options.remote) !== null && _options$remote3 !== void 0 && _options$remote3.enabled) {
        callback === null || callback === void 0 ? void 0 : callback(null, (0, _convertToRemoteAssets.convertToRemoteAssets)({
          assets,
          assetsDirname,
          remotePublicPath: options.remote.publicPath,
          resourceDirname,
          resourceExtensionType,
          resourceFilename,
          resourcePath,
          suffixPattern,
          pathSeparatorRegexp
        }));
      } else {
        callback === null || callback === void 0 ? void 0 : callback(null, await (0, _extractAssets.extractAssets)({
          resourcePath,
          resourceDirname,
          resourceFilename,
          resourceExtensionType,
          assets,
          suffixPattern,
          assetsDirname,
          pathSeparatorRegexp,
          publicPath: options.publicPath,
          devServerEnabled: options.devServerEnabled
        }, logger));
      }
    }
  } catch (error) {
    callback === null || callback === void 0 ? void 0 : callback(error);
  }
}
//# sourceMappingURL=assetsLoader.js.map