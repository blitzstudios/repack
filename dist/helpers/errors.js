"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigurationError = exports.CLIError = void 0;
var _env = require("../env.js");
var _helpers = require("./helpers.js");
class ConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigurationError';

    // hide stack trace in non-verbose mode
    if (!(0, _helpers.isTruthyEnv)(process.env[_env.VERBOSE_ENV_KEY])) {
      this.stack = undefined;
    }
  }
}
exports.ConfigurationError = ConfigurationError;
class CLIError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CLIError';

    // hide stack trace in non-verbose mode
    if (!(0, _helpers.isTruthyEnv)(process.env[_env.VERBOSE_ENV_KEY])) {
      this.stack = undefined;
    }
  }
}
exports.CLIError = CLIError;