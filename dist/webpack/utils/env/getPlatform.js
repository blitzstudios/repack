"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPlatform = getPlatform;

var _getFallbackFromOptions = require("./internal/getFallbackFromOptions");

var _parseCliOptions = require("./internal/parseCliOptions");

function getPlatform(options) {
  const cliOptions = (0, _parseCliOptions.parseCliOptions)();

  if (!cliOptions) {
    return (0, _getFallbackFromOptions.getFallbackFromOptions)(options);
  }

  const args = 'bundle' in cliOptions.arguments ? cliOptions.arguments.bundle : cliOptions.arguments.start;
  return args.platform;
}
//# sourceMappingURL=getPlatform.js.map