"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CLIError = void 0;
var _env = require("../../env.js");
class CLIError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CLIError';

    // hide stack trace in non-verbose mode
    if (!process.env[_env.VERBOSE_ENV_KEY]) {
      this.stack = undefined;
    }
  }
}
exports.CLIError = CLIError;
//# sourceMappingURL=cliError.js.map