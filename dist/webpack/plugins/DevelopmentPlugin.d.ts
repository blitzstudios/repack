import webpack from 'webpack';
import type { DevServerOptions, WebpackPlugin } from '../../types';
/**
 * {@link DevelopmentPlugin} configuration options.
 */
export interface DevelopmentPluginConfig {
    platform: string;
    devServer?: DevServerOptions;
}
/**
 * Class for running development server that handles serving the built bundle, all assets as well as
 * providing Hot Module Replacement functionality.
 *
 * @category Webpack Plugin
 */
export declare class DevelopmentPlugin implements WebpackPlugin {
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
    apply(compiler: webpack.Compiler): void;
}
