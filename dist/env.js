"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isWorker = isWorker;
exports.isVerbose = isVerbose;
exports.CLI_OPTIONS_ENV_KEY = exports.VERBOSE_ENV_KEY = exports.WORKER_ENV_KEY = void 0;
const WORKER_ENV_KEY = 'RNWT_WORKER';
exports.WORKER_ENV_KEY = WORKER_ENV_KEY;
const VERBOSE_ENV_KEY = 'RNWT_VERBOSE';
exports.VERBOSE_ENV_KEY = VERBOSE_ENV_KEY;
const CLI_OPTIONS_ENV_KEY = 'RNWT_CLI_OPTIONS';
/**
 * Checks if code is running as a worker.
 *
 * @returns True if running as a worker.
 *
 * @internal
 */

exports.CLI_OPTIONS_ENV_KEY = CLI_OPTIONS_ENV_KEY;

function isWorker() {
  return Boolean(process.env[WORKER_ENV_KEY]);
}
/**
 * Checks if code is running in verbose mode.
 *
 * @returns True if running in verbose mode.
 *
 * @internal
 */


function isVerbose() {
  return Boolean(process.env[VERBOSE_ENV_KEY]);
}
//# sourceMappingURL=env.js.map