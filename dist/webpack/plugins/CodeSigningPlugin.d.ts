import webpack from 'webpack';
import type { WebpackPlugin } from '../../types';
/**
 * {@link CodeSigningPlugin} configuration options.
 */
export interface CodeSigningPluginConfig {
    /** Whether the plugin is enabled. Defaults to true */
    enabled?: boolean;
    /** Output path to a directory, where signed bundles should be saved. */
    outputPath: string;
    /** Path to the private key. */
    privateKeyPath: string;
    /** Names of chunks to exclude from being signed. */
    excludeChunks?: string[];
}
export declare class CodeSigningPlugin implements WebpackPlugin {
    private config;
    /**
     * Constructs new `RepackPlugin`.
     *
     * @param config Plugin configuration options.
     */
    constructor(config: CodeSigningPluginConfig);
    /**
     * Apply the plugin.
     *
     * @param compiler Webpack compiler instance.
     */
    apply(compiler: webpack.Compiler): void;
}
