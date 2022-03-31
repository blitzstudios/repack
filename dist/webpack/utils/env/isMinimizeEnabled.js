"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMinimizeEnabled = isMinimizeEnabled;

var _getFallbackFromOptions = require("./internal/getFallbackFromOptions");

var _parseCliOptions = require("./internal/parseCliOptions");

function isMinimizeEnabled(options = {
  fallback: false
}) {
  const cliOptions = (0, _parseCliOptions.parseCliOptions)();

  if (!cliOptions) {
    return (0, _getFallbackFromOptions.getFallbackFromOptions)(options);
  }

  if ('bundle' in cliOptions.arguments) {
    var _cliOptions$arguments;

    return (_cliOptions$arguments = cliOptions.arguments.bundle.minify) !== null && _cliOptions$arguments !== void 0 ? _cliOptions$arguments : !cliOptions.arguments.bundle.dev;
  } else {
    return (0, _getFallbackFromOptions.getFallbackFromOptions)(options);
  }
}
//# sourceMappingURL=isMinimizeEnabled.js.map