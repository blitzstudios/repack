import type { Compiler as RspackCompiler } from '@rspack/core';
import type { Compiler as WebpackCompiler } from 'webpack';
import { HermesBytecodePlugin, type HermesBytecodePluginConfig } from './HermesBytecodePlugin.js';
/**
 * @deprecated Use `HermesBytecodePlugin` instead.
 *
 * ChunksToHermesBytecodePlugin was renamed to HermesBytecodePlugin.
 * This is a deprecated alias that will be removed in the next major version.
 */
export declare class ChunksToHermesBytecodePlugin extends HermesBytecodePlugin {
    constructor(config: HermesBytecodePluginConfig);
    apply(compiler: RspackCompiler): void;
    apply(compiler: WebpackCompiler): void;
}
