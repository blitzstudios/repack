import type { Compiler as RspackCompiler } from '@rspack/core';
import type { Compiler as WebpackCompiler } from 'webpack';
/**
 * {@link DevelopmentPlugin} configuration options.
 */
export interface DevelopmentPluginConfig {
    listenerIP?: string;
    /**
     * Target application platform.
     */
    platform?: string;
}
/**
 * Class for running development server that handles serving the built bundle, all assets as well as
 * providing Hot Module Replacement functionality.
 *
 * @category Webpack Plugin
 */
export declare class DevelopmentPlugin {
    private config;
    /**
     * Constructs new `DevelopmentPlugin`.
     *
     * @param config Plugin configuration options.
     */
    constructor(config: DevelopmentPluginConfig);
    private getEntryNormalizedEntryChunks;
    private getModuleFederationEntryChunks;
    private getProtocolType;
    apply(compiler: RspackCompiler): void;
    apply(compiler: WebpackCompiler): void;
}
