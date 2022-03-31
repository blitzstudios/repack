import webpack from 'webpack';
import { Rule, WebpackPlugin } from '../../types';
/**
 * {@link OutputPlugin} configuration options.
 */
export interface OutputPluginConfig {
    /** Target application platform. */
    platform: string;
    /** Whether the development server is enabled and running. */
    devServerEnabled?: boolean;
    /**
     * Mark all chunks as a local chunk, meaning they will be bundled into the `.ipa`/`.apk` file.
     * All chunks not matched by the rule(s) will become a remote one.
     */
    localChunks?: Rule | Rule[];
    /**
     * Output directory for all remote chunks and assets that are not bundled into
     * the `.ipa`/`.apk` file.
     * When left unspecified (`undefined`), the files will be available under `output.path`, next to
     * the main/index bundle and other local chunks.
     */
    remoteChunksOutput?: string;
}
/**
 * Plugin for copying generated files (bundle, chunks, assets) from Webpack's built location to the
 * React Native application directory, so that the files can be packed together into the `ipa`/`apk`.
 *
 * @category Webpack Plugin
 */
export declare class OutputPlugin implements WebpackPlugin {
    private config;
    /**
     * Constructs new `OutputPlugin`.
     *
     * @param config Plugin configuration options.
     */
    constructor(config: OutputPluginConfig);
    /**
     * Apply the plugin.
     *
     * @param compiler Webpack compiler instance.
     */
    apply(compiler: webpack.Compiler): void;
}
