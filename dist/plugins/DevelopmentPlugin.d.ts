import type { Compiler, RspackPluginInstance } from '@rspack/core';
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
export declare class DevelopmentPlugin implements RspackPluginInstance {
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
    /**
     * Apply the plugin.
     *
     * @param compiler Webpack compiler instance.
     */
    apply(compiler: Compiler): void;
}
