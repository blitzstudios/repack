"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRspackConfigFilePath = getRspackConfigFilePath;
exports.getWebpackConfigFilePath = getWebpackConfigFilePath;
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodeOs = _interopRequireDefault(require("node:os"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _nodeUrl = _interopRequireDefault(require("node:url"));
var _consts = require("../consts");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function getConfigFilePath(root, candidates) {
  for (const candidate of candidates) {
    const filename = _nodePath.default.isAbsolute(candidate) ? candidate : _nodePath.default.join(root, candidate);
    if (_nodeFs.default.existsSync(filename)) {
      if (_nodePath.default.extname(filename) === '.mjs' && _nodeOs.default.platform() === 'win32') {
        return _nodeUrl.default.pathToFileURL(filename).href;
      }
      return filename;
    }
  }
  throw new Error('Cannot find configuration file');
}
function getWebpackConfigFilePath(root, customPath) {
  const candidates = customPath ? [customPath] : _consts.DEFAULT_WEBPACK_CONFIG_LOCATIONS;
  try {
    return getConfigFilePath(root, candidates);
  } catch {
    throw new Error('Cannot find Webpack configuration file');
  }
}
function getRspackConfigFilePath(root, customPath) {
  const candidates = customPath ? [customPath] : _consts.DEFAULT_RSPACK_CONFIG_LOCATIONS;
  try {
    return getConfigFilePath(root, candidates);
  } catch {
    throw new Error('Cannot find Rspack configuration file');
  }
}
//# sourceMappingURL=getConfigFilePath.js.map