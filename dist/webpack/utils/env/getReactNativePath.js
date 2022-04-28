"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReactNativePath = getReactNativePath;

var _path = _interopRequireDefault(require("path"));

var _getFallbackFromOptions = require("./internal/getFallbackFromOptions");

var _parseCliOptions = require("./internal/parseCliOptions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getReactNativePath(options = {
  fallback: _path.default.dirname(require.resolve('react-native'))
}) {
  const cliOptions = (0, _parseCliOptions.parseCliOptions)();

  if (!cliOptions) {
    return (0, _getFallbackFromOptions.getFallbackFromOptions)(options);
  }

  return cliOptions.config.reactNativePath;
}
//# sourceMappingURL=getReactNativePath.js.map