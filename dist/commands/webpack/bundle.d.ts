import type { Config } from '@react-native-community/cli-types';
import type { BundleArguments } from '../types';
/**
 * Bundle command for React Native Community CLI.
 * It runs Webpack, builds bundle and saves it alongside any other assets and Source Map
 * to filesystem.
 *
 * @param _ Original, non-parsed arguments that were provided when running this command.
 * @param config React Native Community CLI configuration object.
 * @param args Parsed command line arguments.
 *
 * @internal
 * @category CLI command
 */
export declare function bundle(_: string[], cliConfig: Config, args: BundleArguments): Promise<void>;
