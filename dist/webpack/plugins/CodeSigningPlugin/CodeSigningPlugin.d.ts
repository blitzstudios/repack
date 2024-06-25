import webpack from 'webpack';
import type { WebpackPlugin } from '../../../types';
import { CodeSigningPluginConfig } from './config';
export declare class CodeSigningPlugin implements WebpackPlugin {
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
    apply(compiler: webpack.Compiler): void;
}
