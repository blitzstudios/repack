"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilesInDirectory = getFilesInDirectory;
exports.getImageSize = getImageSize;
exports.getScaleNumber = getScaleNumber;
exports.readFile = readFile;

var _path = _interopRequireDefault(require("path"));

var _imageSize = _interopRequireDefault(require("image-size"));

var _escapeStringRegexp = _interopRequireDefault(require("escape-string-regexp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getFilesInDirectory(dirname, fs) {
  return await new Promise((resolve, reject) => fs.readdir(dirname, (error, results) => {
    if (error) {
      reject(error);
    } else {
      resolve((results === null || results === void 0 ? void 0 : results.filter(result => typeof result === 'string')) ?? []);
    }
  }));
}

function getScaleNumber(scaleKey) {
  return parseFloat(scaleKey.replace(/[^\d.]/g, ''));
}

async function readFile(filename, fs) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (error, results) => {
      if (error) {
        reject(error);
      } else if (results) {
        resolve(results);
      } else {
        reject(new Error(`Read file operation on ${filename} returned empty content.`));
      }
    });
  });
}

function getImageSize({
  resourcePath,
  resourceFilename,
  suffixPattern
}) {
  let info;

  try {
    info = (0, _imageSize.default)(resourcePath);
    const [, scaleMatch = ''] = _path.default.basename(resourcePath).match(new RegExp(`^${(0, _escapeStringRegexp.default)(resourceFilename)}${suffixPattern}`)) ?? [];

    if (scaleMatch) {
      const scale = Number(scaleMatch.replace(/[^\d.]/g, ''));

      if (typeof scale === 'number' && Number.isFinite(scale)) {
        info.width && (info.width /= scale);
        info.height && (info.height /= scale);
      }
    }
  } catch {// Asset is not an image
  }

  return info;
}
//# sourceMappingURL=utils.js.map