import webpack from 'webpack';
import { WebpackPlugin } from '../../../types';
import { DevServerConfig } from '../../../server';
/**
 * {@link DevServerPlugin} configuration options.
 */
export interface DevServerPluginConfig extends Omit<DevServerConfig, 'context'> {
    /** Whether to run development server or not. */
    enabled?: boolean;
    /**
     * Whether Hot Module Replacement / React Refresh should be enabled. Defaults to `true`.
     */
    hmr?: boolean;
}
/**
 * Class for running development server that handles serving the built bundle, all assets as well as
 * providing Hot Module Replacement functionality.
 *
 * @category Webpack Plugin
 */
export declare class DevServerPlugin implements WebpackPlugin {
    private config;
    /**
     * Constructs new `DevServerPlugin`.
     *
     * @param config Plugin configuration options.
     */
    constructor(config: DevServerPluginConfig);
    /**
     * Apply the plugin.
     *
     * @param compiler Webpack compiler instance.
     */
    apply(compiler: webpack.Compiler): void;
    private runAdbReverse;
}
