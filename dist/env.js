"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WORKER_ENV_KEY = exports.VERBOSE_ENV_KEY = exports.DEFAULT_PORT = void 0;
exports.isVerbose = isVerbose;
exports.isWorker = isWorker;
const WORKER_ENV_KEY = 'REPACK_WORKER';
exports.WORKER_ENV_KEY = WORKER_ENV_KEY;
const VERBOSE_ENV_KEY = 'REPACK_VERBOSE';
/** Default development server port. */

exports.VERBOSE_ENV_KEY = VERBOSE_ENV_KEY;
const DEFAULT_PORT = 8081;
/**
 * Checks if code is running as a worker.
 *
 * @returns True if running as a worker.
 *
 * @internal
 */

exports.DEFAULT_PORT = DEFAULT_PORT;

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