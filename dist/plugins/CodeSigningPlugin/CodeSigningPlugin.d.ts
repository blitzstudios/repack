import type { Compiler as RspackCompiler } from '@rspack/core';
import type { Compiler as WebpackCompiler } from 'webpack';
import { type CodeSigningPluginConfig } from './config.js';
export declare class CodeSigningPlugin {
    private config;
    private chunkFilenames;
    /**
     * Constructs new `RepackPlugin`.
     *
     * @param config Plugin configuration options.
     */
    constructor(config: CodeSigningPluginConfig);
    private shouldSignFile;
    apply(compiler: RspackCompiler): void;
    apply(compiler: WebpackCompiler): void;
}
