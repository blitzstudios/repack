"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMode = getMode;

var _getFallbackFromOptions = require("./internal/getFallbackFromOptions");

var _parseCliOptions = require("./internal/parseCliOptions");

function getMode(options = {
  fallback: 'production'
}) {
  const cliOptions = (0, _parseCliOptions.parseCliOptions)();

  if (!cliOptions) {
    return (0, _getFallbackFromOptions.getFallbackFromOptions)(options);
  }

  if ('bundle' in cliOptions.arguments) {
    return cliOptions.arguments.bundle.dev ? 'development' : 'production';
  } else {
    return 'development';
  }
}
//# sourceMappingURL=getMode.js.map