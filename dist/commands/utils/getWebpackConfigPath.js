"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWebpackConfigPath = getWebpackConfigPath;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _os = _interopRequireDefault(require("os"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Supports the same files as Webpack CLI.
const DEFAULT_WEBPACK_CONFIG_LOCATIONS = ['webpack.config.mjs', 'webpack.config.cjs', 'webpack.config.js', '.webpack/webpack.config.mjs', '.webpack/webpack.config.cjs', '.webpack/webpack.config.js', '.webpack/webpackfile'];

function getWebpackConfigPath(root, customPath) {
  const candidates = customPath ? [customPath] : DEFAULT_WEBPACK_CONFIG_LOCATIONS;

  for (const candidate of candidates) {
    const filename = _path.default.isAbsolute(candidate) ? candidate : _path.default.join(root, candidate);

    if (_fs.default.existsSync(filename)) {
      if (_path.default.isAbsolute(candidate) && candidate.endsWith('.mjs') && _os.default.platform() === 'win32') {
        return `file:\\${filename}`;
      } else {
        return filename;
      }
    }
  }

  throw new Error('Cannot find Webpack configuration file');
}
//# sourceMappingURL=getWebpackConfigPath.js.map