import type { BundleArguments, CliConfig } from '../types.js';
/**
 * Bundle command that builds and saves the bundle
 * alongside any other assets to filesystem using Webpack.
 *
 * @param _ Original, non-parsed arguments that were provided when running this command.
 * @param cliConfig Configuration object containing platform and project settings.
 * @param args Parsed command line arguments.
 */
export declare function bundle(_: string[], cliConfig: CliConfig, args: BundleArguments): Promise<void>;
