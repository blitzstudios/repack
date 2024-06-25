"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WORKER_ENV_KEY = exports.VERBOSE_ENV_KEY = exports.DEFAULT_PORT = exports.DEFAULT_HOSTNAME = void 0;
exports.isVerbose = isVerbose;
exports.isWorker = isWorker;
const WORKER_ENV_KEY = exports.WORKER_ENV_KEY = 'REPACK_WORKER';
const VERBOSE_ENV_KEY = exports.VERBOSE_ENV_KEY = 'REPACK_VERBOSE';

/**
 * Default development server hostname.
 * Allows for listening for connections from all network interfaces.
 */
const DEFAULT_HOSTNAME = exports.DEFAULT_HOSTNAME = 'localhost';

/** Default development server port. */
const DEFAULT_PORT = exports.DEFAULT_PORT = +process.env.RCT_METRO_PORT || 8081;

/**
 * Checks if code is running as a worker.
 *
 * @returns True if running as a worker.
 *
 * @internal
 */
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