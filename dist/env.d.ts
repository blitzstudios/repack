export declare const WORKER_ENV_KEY = "REPACK_WORKER";
export declare const VERBOSE_ENV_KEY = "REPACK_VERBOSE";
/** Default development server port. */
export declare const DEFAULT_PORT = 8081;
/**
 * Checks if code is running as a worker.
 *
 * @returns True if running as a worker.
 *
 * @internal
 */
export declare function isWorker(): boolean;
/**
 * Checks if code is running in verbose mode.
 *
 * @returns True if running in verbose mode.
 *
 * @internal
 */
export declare function isVerbose(): boolean;
