import type { BundleArguments, ConfigurationObject, StartArguments } from '../../types.js';
interface MakeCompilerConfigOptions {
    args: StartArguments | BundleArguments;
    bundler: 'rspack' | 'webpack';
    command: 'start' | 'bundle';
    rootDir: string;
    platforms: string[];
    reactNativePath: string;
}
export declare function makeCompilerConfig<C extends ConfigurationObject>(options: MakeCompilerConfigOptions): Promise<C[]>;
export {};
