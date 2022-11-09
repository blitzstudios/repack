export const WORKER_ENV_KEY = 'REPACK_WORKER';

export const VERBOSE_ENV_KEY = 'REPACK_VERBOSE';

/** Default development server port. */
export const DEFAULT_PORT = +(process.env.RCT_METRO_PORT as string) || 8081;

/**
 * Checks if code is running as a worker.
 *
 * @returns True if running as a worker.
 *
 * @internal
 */
export function isWorker() {
  return Boolean(process.env[WORKER_ENV_KEY]);
}

/**
 * Checks if code is running in verbose mode.
 *
 * @returns True if running in verbose mode.
 *
 * @internal
 */
export function isVerbose() {
  return Boolean(process.env[VERBOSE_ENV_KEY]);
}
