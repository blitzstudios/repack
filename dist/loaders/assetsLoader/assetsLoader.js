"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = repackAssetsLoader;
exports.raw = void 0;
var _nodePath = _interopRequireDefault(require("node:path"));
var _nodeUtil = _interopRequireDefault(require("node:util"));
var _index = require("../../utils/index.js");
var _convertToRemoteAssets = require("./convertToRemoteAssets.js");
var _extractAssets = require("./extractAssets.js");
var _inlineAssets = require("./inlineAssets.js");
var _options = require("./options.js");
var _utils = require("./utils.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const raw = exports.raw = true;
const testXml = /\.(xml)$/;
const testMP4 = /\.(mp4)$/;
const testImages = /\.(png|jpg|gif|webp)$/;
const testFonts = /\.(ttf|otf|ttc)$/;
async function repackAssetsLoader(assetData) {
  this.cacheable();
  const callback = this.async();
  const logger = this.getLogger('repackAssetsLoader');
  const options = (0, _options.getOptions)(this);
  const isDev = !!this._compiler.options.devServer;
  const platform = options.platform ?? this._compiler.options.name;
  const readDirAsync = _nodeUtil.default.promisify(this.fs.readdir);
  const readFileAsync = _nodeUtil.default.promisify(this.fs.readFile);
  logger.debug(`Processing asset ${this.resourcePath}`);
  try {
    // defaults
    const scalableAssetExtensions = options.scalableAssetExtensions ?? _index.SCALABLE_ASSETS;
    const scalableAssetResolutions = options.scalableAssetResolutions ?? _index.SCALABLE_RESOLUTIONS;
    const pathSeparatorRegexp = new RegExp(`\\${_nodePath.default.sep}`, 'g');
    const resourcePath = this.resourcePath;
    const resourceAbsoluteDirname = _nodePath.default.dirname(resourcePath);
    // Relative path to rootContext without any ../ due to https://github.com/callstack/haul/issues/474
    // Assets from from outside of rootContext, should still be placed inside bundle output directory.
    // Example:
    //   resourcePath    = <abs>/monorepo/node_modules/my-module/image.png
    //   dirname         = <abs>/monorepo/node_modules/my-module
    //   rootContext     = <abs>/monorepo/packages/my-app/
    //   resourceDirname = ../../node_modules/my-module (original)
    // So when we calculate destination for the asset for iOS (assetsDirname + resourceDirname + filename),
    // it will end up outside of `assets` directory, so we have to make sure it's:
    //   resourceDirname = node_modules/my-module (tweaked)
    const resourceDirname = _nodePath.default.relative(this.rootContext, resourceAbsoluteDirname).replace(new RegExp(`^[\\.\\${_nodePath.default.sep}]+`), '');
    const resourceExtensionType = _nodePath.default.extname(resourcePath).replace(/^\./, '');
    const suffixPattern = `(@\\d+(\\.\\d+)?x)?(\\.(${platform}|native))?\\.${resourceExtensionType}$`;
    const resourceFilename = _nodePath.default.basename(resourcePath).replace(new RegExp(suffixPattern), '');
    // Name with embedded resourceDirname eg `node_modules_reactnative_libraries_newappscreen_components_logo.png`
    const resourceNormalizedFilename = `${(resourceDirname.length === 0 ? resourceFilename : `${resourceDirname.replace(pathSeparatorRegexp, '_')}_${resourceFilename}`).toLowerCase().replace(/[^a-z0-9_]/g, '')}.${resourceExtensionType}`;
    const assetsDirname = 'assets';
    const remoteAssetsDirname = 'remote-assets';
    const scales = await (0, _utils.collectScales)(resourceAbsoluteDirname, resourceFilename, resourceExtensionType, scalableAssetExtensions, scalableAssetResolutions, platform, readDirAsync);
    const scaleKeys = Object.keys(scales).sort((a, b) => (0, _utils.getScaleNumber)(a) - (0, _utils.getScaleNumber)(b));
    for (const scaleKey of scaleKeys) {
      const assetPath = scales[scaleKey];
      this.addDependency(assetPath);
    }
    const remoteAssetPathOption = options.remote?.enabled && options.remote?.assetPath ? options.remote?.assetPath({
      resourcePath,
      resourceFilename,
      resourceDirname,
      resourceExtensionType
    }) : null;
    const remoteAssetResource = remoteAssetPathOption ? {
      filename: _nodePath.default.basename(remoteAssetPathOption, `.${resourceExtensionType}`),
      path: _nodePath.default.dirname(remoteAssetPathOption)
    } : null;

    // assets are sorted by scale, in ascending order
    const assets = await Promise.all(scaleKeys.map(async scaleKey => {
      const assetPath = scales[scaleKey];
      const isLoaded = assetPath === resourcePath;
      // use raw Buffer passed to loader to avoid unnecessary read
      const content = isLoaded ? assetData : await readFileAsync(assetPath);
      let destination;
      if (!isDev && !options.remote?.enabled && platform === 'android') {
        // found font family
        if (testXml.test(resourceNormalizedFilename) && content?.indexOf('font-family') !== -1) {
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
              throw new Error(`Unknown scale ${scaleKey} for ${assetPath}`);
          }
        } else {
          // everything else is going to RAW
          destination = 'raw';
        }
        destination = _nodePath.default.join(destination, resourceNormalizedFilename);
      } else {
        const name = `${remoteAssetResource?.filename ?? resourceFilename}${scaleKey === '@1x' ? '' : scaleKey}.${resourceExtensionType}`;
        if (options.remote?.enabled) {
          destination = _nodePath.default.join(remoteAssetsDirname, assetsDirname, remoteAssetResource?.path ?? resourceDirname, name);
        } else {
          destination = _nodePath.default.join(assetsDirname, resourceDirname, name);
        }
      }
      const scale = (0, _utils.getScaleNumber)(scaleKey);
      const dimensions = (0, _utils.getAssetDimensions)({
        resourceData: content,
        resourceScale: scale
      });
      return {
        data: content,
        dimensions,
        filename: destination,
        scale
      };
    }));
    logger.debug(`Resolved request ${this.resourcePath}`, JSON.stringify({
      platform,
      rootContext: this.rootContext,
      resourceNormalizedFilename,
      resourceFilename,
      resourceDirname,
      resourceAbsoluteDirname,
      resourceExtensionType,
      scales,
      assets: assets.map(asset => ({
        ...asset,
        content: `size=${asset.data.length} type=${typeof asset.data}`
      }))
    }));
    let result;
    if (options.inline) {
      logger.debug(`Inlining assets for request ${resourcePath}`);
      result = (0, _inlineAssets.inlineAssets)({
        assets,
        resourcePath
      });
    } else {
      for (const asset of assets) {
        const {
          data,
          filename
        } = asset;
        logger.debug(`Emitting asset ${filename} for request ${resourcePath}`);

        // Assets are emitted relatively to `output.path`.
        this.emitFile(filename, data ?? '');
      }
      if (options.remote?.enabled) {
        result = (0, _convertToRemoteAssets.convertToRemoteAssets)({
          assets,
          assetsDirname,
          remotePublicPath: options.remote.publicPath,
          resourceDirname: remoteAssetResource?.path ?? resourceDirname,
          resourceExtensionType,
          resourceFilename: remoteAssetResource?.filename ?? resourceFilename,
          resourcePath,
          suffixPattern,
          pathSeparatorRegexp
        });
      } else {
        result = (0, _extractAssets.extractAssets)({
          resourcePath,
          resourceDirname,
          resourceFilename,
          resourceExtensionType,
          assets,
          suffixPattern,
          assetsDirname,
          pathSeparatorRegexp,
          publicPath: options.publicPath,
          isDev
        }, logger);
      }
    }
    callback?.(null, result);
  } catch (error) {
    callback?.(error);
  }
}