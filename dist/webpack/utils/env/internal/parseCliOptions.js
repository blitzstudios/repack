"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseCliOptions = parseCliOptions;

var _env = require("../../../../env");

function parseCliOptions() {
  const rawCliOptions = process.env[_env.CLI_OPTIONS_ENV_KEY];

  if (!rawCliOptions) {
    return undefined;
  }

  return JSON.parse(rawCliOptions);
}
//# sourceMappingURL=parseCliOptions.js.map