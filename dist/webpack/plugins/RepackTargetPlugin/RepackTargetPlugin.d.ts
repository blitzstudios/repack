import webpack from 'webpack';
import type { DevServerOptions, WebpackPlugin } from '../../../types';
/**
 * {@link RepackTargetPlugin} configuration options.
 */
export interface RepackTargetPluginConfig extends Pick<DevServerOptions, 'hmr'> {
}
/**
 * Plugin for tweaking the JavaScript runtime code to account for React Native environment.
 *
 * Globally available APIs differ with React Native and other target's like Web, so there are some
 * tweaks necessary to make the final bundle runnable inside React Native's JavaScript VM.
 *
 * @category Webpack Plugin
 */
export declare class RepackTargetPlugin implements WebpackPlugin {
    private config?;
    /**
     * Constructs new `RepackTargetPlugin`.
     *
     * @param config Plugin configuration options.
     */
    constructor(config?: RepackTargetPluginConfig | undefined);
    /**
     * Apply the plugin.
     *
     * @param compiler Webpack compiler instance.
     */
    apply(compiler: webpack.Compiler): void;
}
