import type { Compiler as RspackCompiler } from '@rspack/core';
import type { Compiler as WebpackCompiler } from 'webpack';
interface SourceMapPluginConfig {
    platform?: string;
}
export declare class SourceMapPlugin {
    private config;
    constructor(config?: SourceMapPluginConfig);
    apply(compiler: RspackCompiler): void;
    apply(compiler: WebpackCompiler): void;
}
export {};
