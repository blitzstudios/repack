import type { Compilation, Compiler as RspackCompiler } from '@rspack/core';
import type { Compiler as WebpackCompiler, RuntimeModule as WebpackRuntimeModule } from 'webpack';
type RspackRuntimeModule = Parameters<Compilation['hooks']['runtimeModule']['call']>[0];
/**
 * Plugin for tweaking the JavaScript runtime code to account for React Native environment.
 *
 * Globally available APIs differ with React Native and other target's like Web, so there are some
 * tweaks necessary to make the final bundle runnable inside React Native's JavaScript VM.
 *
 * @category Webpack Plugin
 */
export declare class RepackTargetPlugin {
    replaceRuntimeModule(module: RspackRuntimeModule | WebpackRuntimeModule, content: string): void;
    apply(compiler: RspackCompiler): void;
    apply(compiler: WebpackCompiler): void;
}
export {};
