"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfigFilePath = getConfigFilePath;
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _index = require("../../../helpers/index.js");
var _consts = require("../../consts.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function discoverConfigFilePath(root, candidates) {
  for (const candidate of candidates) {
    const filename = _nodePath.default.isAbsolute(candidate) ? candidate : _nodePath.default.join(root, candidate);
    if (_nodeFs.default.existsSync(filename)) {
      return filename;
    }
  }
  throw new _index.CLIError('Cannot find configuration file');
}
function getWebpackConfigFilePath(root, customPath) {
  const candidates = customPath ? [customPath] : _consts.DEFAULT_WEBPACK_CONFIG_LOCATIONS;
  try {
    return discoverConfigFilePath(root, candidates);
  } catch {
    throw new _index.CLIError('Cannot find Webpack configuration file');
  }
}
function getRspackConfigFilePath(root, customPath) {
  const candidates = customPath ? [customPath] : _consts.DEFAULT_RSPACK_CONFIG_LOCATIONS;
  try {
    return discoverConfigFilePath(root, candidates);
  } catch {
    throw new _index.CLIError('Cannot find Rspack configuration file');
  }
}
function getConfigFilePath(bundler, root, customPath) {
  switch (bundler) {
    case 'rspack':
      return getRspackConfigFilePath(root, customPath);
    case 'webpack':
      return getWebpackConfigFilePath(root, customPath);
  }
}