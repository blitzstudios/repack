import type { Compilation, Compiler, RspackPluginInstance } from '@rspack/core';
import type { RuntimeModule as WebpackRuntimeModule } from 'webpack';
type RspackRuntimeModule = Parameters<Compilation['hooks']['runtimeModule']['call']>[0];
/**
 * {@link RepackTargetPlugin} configuration options.
 */
export interface RepackTargetPluginConfig {
    hmr?: boolean;
}
/**
 * Plugin for tweaking the JavaScript runtime code to account for React Native environment.
 *
 * Globally available APIs differ with React Native and other target's like Web, so there are some
 * tweaks necessary to make the final bundle runnable inside React Native's JavaScript VM.
 *
 * @category Webpack Plugin
 */
export declare class RepackTargetPlugin implements RspackPluginInstance {
    private config?;
    /**
     * Constructs new `RepackTargetPlugin`.
     *
     * @param config Plugin configuration options.
     */
    constructor(config?: RepackTargetPluginConfig | undefined);
    replaceRuntimeModule(module: RspackRuntimeModule | WebpackRuntimeModule, content: string): void;
    /**
     * Apply the plugin.
     *
     * @param compiler Webpack compiler instance.
     */
    apply(compiler: Compiler): void;
}
export {};
