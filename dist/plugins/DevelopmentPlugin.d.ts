import type { Compiler, RspackPluginInstance } from '@rspack/core';
import type { DevServerOptions } from '../types';
/**
 * {@link DevelopmentPlugin} configuration options.
 */
export interface DevelopmentPluginConfig {
    entryName?: string;
    platform: string;
    devServer?: DevServerOptions;
    listenerIP?: string;
}
/**
 * Class for running development server that handles serving the built bundle, all assets as well as
 * providing Hot Module Replacement functionality.
 *
 * @category Webpack Plugin
 */
export declare class DevelopmentPlugin implements RspackPluginInstance {
    private config?;
    /**
     * Constructs new `DevelopmentPlugin`.
     *
     * @param config Plugin configuration options.
     */
    constructor(config?: DevelopmentPluginConfig | undefined);
    /**
     * Apply the plugin.
     *
     * @param compiler Webpack compiler instance.
     */
    apply(compiler: Compiler): void;
}
