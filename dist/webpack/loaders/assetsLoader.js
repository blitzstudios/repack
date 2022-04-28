"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reactNativeAssetsLoader;
exports.raw = void 0;

var _path = _interopRequireDefault(require("path"));

var _loaderUtils = _interopRequireDefault(require("loader-utils"));

var _schemaUtils = require("schema-utils");

var _imageSize = require("image-size");

var _dedent = _interopRequireDefault(require("dedent"));

var _hasha = _interopRequireDefault(require("hasha"));

var _mimeTypes = _interopRequireDefault(require("mime-types"));

var _escapeStringRegexp = _interopRequireDefault(require("escape-string-regexp"));

var _AssetResolver = require("../plugins/AssetsResolverPlugin/AssetResolver");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const URIRegEx = /^data:([^;,]+)?((?:;[^;,]+)*?)(?:;(base64))?,(.*)$/i;

function getOptions(loaderContext) {
  const options = _loaderUtils.default.getOptions(loaderContext) || {};
  (0, _schemaUtils.validate)({
    type: 'object',
    required: ['platform', 'scalableAssetExtensions'],
    properties: {
      platform: {
        type: 'string'
      },
      scalableAssetExtensions: {
        type: 'array'
      },
      inline: {
        type: 'boolean'
      },
      devServerEnabled: {
        type: 'boolean'
      },
      publicPath: {
        type: 'string'
      }
    }
  }, options, {
    name: 'reactNativeAssetsLoader'
  });
  return options;
}

const raw = true;
exports.raw = raw;

async function reactNativeAssetsLoader() {
  this.cacheable();
  const callback = this.async();
  const logger = this.getLogger('reactNativeAssetsLoader');
  const rootContext = this.rootContext;
  logger.debug('Processing:', this.resourcePath);

  try {
    var _info, _info2;

    const options = getOptions(this);
    const pathSeparatorPattern = new RegExp(`\\${_path.default.sep}`, 'g');
    const resourcePath = this.resourcePath;

    const dirname = _path.default.dirname(resourcePath); // Relative path to rootContext without any ../ due to https://github.com/callstack/haul/issues/474
    // Assets from from outside of rootContext, should still be placed inside bundle output directory.
    // Example:
    //   resourcePath    = monorepo/node_modules/my-module/image.png
    //   dirname         = monorepo/node_modules/my-module
    //   rootContext     = monorepo/packages/my-app/
    //   relativeDirname = ../../node_modules/my-module (original)
    // So when we calculate destination for the asset for iOS ('assets' + relativeDirname + filename),
    // it will end up outside of `assets` directory, so we have to make sure it's:
    //   relativeDirname = node_modules/my-module (tweaked)


    const relativeDirname = _path.default.relative(rootContext, dirname).replace(new RegExp(`^[\\.\\${_path.default.sep}]+`), '');

    const type = _path.default.extname(resourcePath).replace(/^\./, '');

    const assetsPath = 'assets';
    const suffix = `(@\\d+(\\.\\d+)?x)?(\\.(${options.platform}|native))?\\.${type}$`;

    const filename = _path.default.basename(resourcePath).replace(new RegExp(suffix), ''); // Name with embedded relative dirname eg `node_modules_reactnative_libraries_newappscreen_components_logo.png`


    const normalizedName = `${(relativeDirname.length === 0 ? filename : `${relativeDirname.replace(pathSeparatorPattern, '_')}_${filename}`).toLowerCase().replace(/[^a-z0-9_]/g, '')}.${type}`;
    const files = await new Promise((resolve, reject) => this.fs.readdir(dirname, (error, results) => {
      if (error) {
        reject(error);
      } else {
        var _filter;

        resolve((_filter = results === null || results === void 0 ? void 0 : results.filter(result => typeof result === 'string')) !== null && _filter !== void 0 ? _filter : []);
      }
    }));

    const scales = _AssetResolver.AssetResolver.collectScales(options.scalableAssetExtensions, files, {
      name: filename,
      type,
      platform: options.platform
    });

    const scaleKeys = Object.keys(scales).sort((a, b) => parseFloat(a.replace(/[^\d.]/g, '')) - parseFloat(b.replace(/[^\d.]/g, '')));
    const scaleNumbers = scaleKeys.map(scale => parseFloat(scale.replace(/[^\d.]/g, '')));
    const assets = await Promise.all(scaleKeys.map(scale => {
      const scaleFilePath = _path.default.join(dirname, scales[scale].name);

      this.addDependency(scaleFilePath);
      return new Promise((resolve, reject) => this.fs.readFile(scaleFilePath, (error, results) => {
        if (error) {
          reject(error);
        } else {
          let destination;

          if (!options.devServerEnabled && options.platform === 'android') {
            const testXml = /\.(xml)$/;
            const testMP4 = /\.(mp4)$/;
            const testImages = /\.(png|jpg|gif|webp)$/;
            const testFonts = /\.(ttf|otf|ttc)$/; // found font family

            if (testXml.test(normalizedName) && (results === null || results === void 0 ? void 0 : results.indexOf('font-family')) !== -1) {
              destination = 'font';
            } else if (testFonts.test(normalizedName)) {
              // font extensions
              destination = 'font';
            } else if (testMP4.test(normalizedName)) {
              // video files extensions
              destination = 'raw';
            } else if (testImages.test(normalizedName) || testXml.test(normalizedName)) {
              // images extensions
              switch (scale) {
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
                  throw new Error(`Unknown scale ${scale} for ${scaleFilePath}`);
              }
            } else {
              // everything else is going to RAW
              destination = 'raw';
            }

            destination = _path.default.join(destination, normalizedName);
          } else {
            const name = `${filename}${scale === '@1x' ? '' : scale}.${type}`;
            destination = _path.default.join(assetsPath, relativeDirname, name);
          }

          resolve({
            destination,
            content: results
          });
        }
      }));
    }));
    assets.forEach(asset => {
      if (options.inline) {
        return;
      }

      const {
        destination,
        content
      } = asset;
      logger.debug('Asset emitted:', destination); // Assets are emitted relatively to `output.path`.

      this.emitFile(destination, content !== null && content !== void 0 ? content : '');
    });

    if (options.inline) {
      const {
        content
      } = assets[assets.length - 1];

      if (content) {
        callback === null || callback === void 0 ? void 0 : callback(null, (0, _dedent.default)`
        module.exports = ${JSON.stringify(inlineAssetLoader(content, resourcePath))}
      `);
      }

      return;
    }

    let publicPath = _path.default.join(assetsPath, relativeDirname).replace(pathSeparatorPattern, '/');

    if (options.publicPath) {
      publicPath = _path.default.join(options.publicPath, publicPath);
    }

    const hashes = await Promise.all(assets.map(asset => {
      var _asset$content$toStri, _asset$content;

      return _hasha.default.async((_asset$content$toStri = (_asset$content = asset.content) === null || _asset$content === void 0 ? void 0 : _asset$content.toString()) !== null && _asset$content$toStri !== void 0 ? _asset$content$toStri : asset.destination, {
        algorithm: 'md5'
      });
    }));
    let info;

    try {
      info = (0, _imageSize.imageSize)(this.resourcePath);

      const match = _path.default.basename(this.resourcePath).match(new RegExp(`^${(0, _escapeStringRegexp.default)(filename)}${suffix}`));

      if (match !== null && match !== void 0 && match[1]) {
        const scale = Number(match[1].replace(/[^\d.]/g, ''));

        if (typeof scale === 'number' && Number.isFinite(scale)) {
          info.width && (info.width /= scale);
          info.height && (info.height /= scale);
        }
      }
    } catch (e) {// Asset is not an image
    }

    logger.debug('Asset processed:', {
      resourcePath,
      platform: options.platform,
      rootContext,
      relativeDirname,
      type,
      assetsPath,
      filename,
      normalizedName,
      scales,
      assets: assets.map(asset => asset.destination),
      publicPath,
      width: (_info = info) === null || _info === void 0 ? void 0 : _info.width,
      height: (_info2 = info) === null || _info2 === void 0 ? void 0 : _info2.height
    });
    callback === null || callback === void 0 ? void 0 : callback(null, (0, _dedent.default)`
      var AssetRegistry = require('react-native/Libraries/Image/AssetRegistry');
      module.exports = AssetRegistry.registerAsset({
        __packager_asset: true,
        scales: ${JSON.stringify(scaleNumbers)},
        name: ${JSON.stringify(filename)},
        type: ${JSON.stringify(type)},
        hash: ${JSON.stringify(hashes.join())},
        httpServerLocation: ${JSON.stringify(publicPath)},
        ${options.devServerEnabled ? `fileSystemLocation: ${JSON.stringify(dirname)},` : ''}
        ${info ? `height: ${info.height},` : ''}
        ${info ? `width: ${info.width},` : ''}
      });
      `);
  } catch (error) {
    callback === null || callback === void 0 ? void 0 : callback(error);
  }
}

const decodeDataUriContent = (encoding, content) => {
  const isBase64 = encoding === 'base64';
  return isBase64 ? Buffer.from(content, 'base64') : Buffer.from(decodeURIComponent(content), 'ascii');
};

function inlineAssetLoader(content, resource) {
  const ext = _path.default.extname(resource);

  const match = URIRegEx.exec(resource);
  let resultMimeType;
  let mimeType;
  let parameters;
  let encodedContent;
  let encoding;

  if (match) {
    mimeType = match[1] || '';
    parameters = match[2] || '';
    encoding = match[3] || false;
    encodedContent = match[4] || '';
  }

  if (mimeType !== undefined) {
    resultMimeType = mimeType + parameters;
  } else if (ext) {
    resultMimeType = _mimeTypes.default.lookup(ext);
  }

  if (typeof resultMimeType !== 'string') {
    throw new Error("DataUrl can't be generated automatically, " + `because there is no mimetype for "${ext}" in mimetype database. ` + 'Either pass a mimetype via "generator.mimetype" or ' + 'use type: "asset/resource" to create a resource file instead of a DataUrl');
  }

  let finalEncodedContent;

  if (encoding === 'base64' && decodeDataUriContent(encoding, encodedContent).equals(content instanceof Buffer ? content : decodeDataUriContent(encoding, content))) {
    finalEncodedContent = encodedContent;
  } else {
    finalEncodedContent = content instanceof Buffer ? content.toString('base64') : content;
  }

  const encodedSource = `data:${resultMimeType};base64,${finalEncodedContent}`;
  return {
    uri: encodedSource
  };
}
//# sourceMappingURL=assetsLoader.js.map