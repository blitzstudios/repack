import type { EnvOptions } from '../../../types.js';
import type { BundleArguments, StartArguments } from '../../types.js';
interface GetEnvOptionsOptions {
    args: StartArguments | BundleArguments;
    command: 'start' | 'bundle';
    rootDir: string;
    reactNativePath: string;
}
export declare function getEnvOptions(opts: GetEnvOptionsOptions): EnvOptions;
export {};
