import type { Config } from '@react-native-community/cli-types';
import type { StartArguments } from '../types';
/**
 * Start command for React Native Community CLI.
 * It runs `@callstack/repack-dev-server` to provide Development Server functionality to React Native apps
 * in development mode.
 *
 * @param _ Original, non-parsed arguments that were provided when running this command.
 * @param config React Native Community CLI configuration object.
 * @param args Parsed command line arguments.
 *
 * @internal
 * @category CLI command
 */
export declare function start(_: string[], config: Config, args: StartArguments): Promise<{
    stop: () => Promise<void>;
}>;
