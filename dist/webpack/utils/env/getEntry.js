"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEntry = getEntry;

var _path = _interopRequireDefault(require("path"));

var _getFallbackFromOptions = require("./internal/getFallbackFromOptions");

var _parseCliOptions = require("./internal/parseCliOptions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getEntry(options = {
  fallback: './index.js'
}) {
  const cliOptions = (0, _parseCliOptions.parseCliOptions)();

  if (!cliOptions) {
    return (0, _getFallbackFromOptions.getFallbackFromOptions)(options);
  }

  if ('bundle' in cliOptions.arguments) {
    const {
      entryFile
    } = cliOptions.arguments.bundle;
    return _path.default.isAbsolute(entryFile) || entryFile.startsWith('./') ? entryFile : `./${entryFile}`;
  } else {
    return (0, _getFallbackFromOptions.getFallbackFromOptions)(options);
  }
}
//# sourceMappingURL=getEntry.js.map