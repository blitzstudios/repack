import type { Compiler as RspackCompiler } from '@rspack/core';
import type { Compiler as WebpackCompiler } from 'webpack';
/**
 * @category Webpack Plugin
 */
export declare class ManifestPlugin {
    apply(compiler: RspackCompiler): void;
    apply(compiler: WebpackCompiler): void;
}
