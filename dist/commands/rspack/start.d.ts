import type { CliConfig, StartArguments } from '../types.js';
/**
 * Start command that runs a development server.
 * It runs `@callstack/repack-dev-server` to provide Development Server functionality
 * in development mode.
 *
 * @param _ Original, non-parsed arguments that were provided when running this command.
 * @param cliConfig Configuration object containing platform and project settings.
 * @param args Parsed command line arguments.
 */
export declare function start(_: string[], cliConfig: CliConfig, args: StartArguments): Promise<{
    stop: () => Promise<void>;
}>;
