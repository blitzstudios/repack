import type { Logger } from '../../types.js';
interface RunAdbReverseParams {
    logger?: Logger;
    port: number;
    verbose?: boolean;
    wait?: boolean;
}
/**
 * Runs the adb reverse command to reverse the specified port on all available devices.
 * Performs the following steps:
 * 1. (Optional) Waits for the device to be available.
 * 2. Get a list of all connected devices.
 * 3. Attempts to reverse the specified port using adb for all devices.
 */
export declare function runAdbReverse({ logger, port, verbose, wait, }: RunAdbReverseParams): Promise<void>;
export {};
