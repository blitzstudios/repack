import type { Compiler, RspackPluginInstance } from '@rspack/core';
interface SourceMapPluginConfig {
    platform?: string;
}
export declare class SourceMapPlugin implements RspackPluginInstance {
    private config;
    constructor(config?: SourceMapPluginConfig);
    apply(compiler: Compiler): void;
}
export {};
