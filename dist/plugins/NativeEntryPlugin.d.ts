import type { Compiler, RspackPluginInstance } from '@rspack/core';
export interface NativeEntryPluginConfig {
    /**
     * Absolute location to JS file with initialization logic for React Native.
     * Useful if you want to built for out-of-tree platforms.
     */
    initializeCoreLocation?: string;
}
export declare class NativeEntryPlugin implements RspackPluginInstance {
    private config;
    constructor(config: NativeEntryPluginConfig);
    private getReactNativePath;
    apply(compiler: Compiler): void;
}
