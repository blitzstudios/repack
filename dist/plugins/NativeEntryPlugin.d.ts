import type { Compiler as RspackCompiler } from '@rspack/core';
import type { Compiler as WebpackCompiler } from 'webpack';
export interface NativeEntryPluginConfig {
    /**
     * Absolute location to JS file with initialization logic for React Native.
     * Useful if you want to built for out-of-tree platforms.
     */
    initializeCoreLocation?: string;
}
export declare class NativeEntryPlugin {
    private config;
    constructor(config: NativeEntryPluginConfig);
    private getReactNativePath;
    apply(compiler: RspackCompiler): void;
    apply(compiler: WebpackCompiler): void;
}
