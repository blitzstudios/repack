import type { Compiler, RspackPluginInstance } from '@rspack/core';
import { type CodeSigningPluginConfig } from './config';
export declare class CodeSigningPlugin implements RspackPluginInstance {
    private config;
    private chunkFilenames;
    /**
     * Constructs new `RepackPlugin`.
     *
     * @param config Plugin configuration options.
     */
    constructor(config: CodeSigningPluginConfig);
    private shouldSignFile;
    /**
     * Apply the plugin.
     *
     * @param compiler Webpack compiler instance.
     */
    apply(compiler: Compiler): void;
}
