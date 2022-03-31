export declare const WORKER_ENV_KEY = "RNWT_WORKER";
export declare const VERBOSE_ENV_KEY = "RNWT_VERBOSE";
export declare const CLI_OPTIONS_ENV_KEY = "RNWT_CLI_OPTIONS";
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
