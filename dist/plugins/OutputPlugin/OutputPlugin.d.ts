import type { EntryNormalized, ModuleFilenameHelpers, Compiler as RspackCompiler, StatsChunk } from '@rspack/core';
import type { Compiler as WebpackCompiler } from 'webpack';
import type { DestinationSpec, OutputPluginConfig } from './types.js';
/**
 * Plugin for copying generated files (bundle, chunks, assets) from Webpack's built location to the
 * React Native application directory, so that the files can be packed together into the `ipa`/`apk`.
 *
 * @category Webpack Plugin
 */
export declare class OutputPlugin {
    private config;
    localSpecs: DestinationSpec[];
    remoteSpecs: DestinationSpec[];
    private bundleFilename;
    private assetsPath;
    private sourceMapFilename;
    constructor(config: OutputPluginConfig);
    createChunkMatcher(matchObject: typeof ModuleFilenameHelpers.matchObject): (chunk: StatsChunk, specs: DestinationSpec[]) => DestinationSpec[];
    getRelatedSourceMap(chunk: StatsChunk): string | undefined;
    ensureAbsolutePath(filePath: string): string;
    classifyChunks({ chunks, chunkMatcher, entryOptions, }: {
        chunks: StatsChunk[];
        chunkMatcher: (chunk: StatsChunk, specs: DestinationSpec[]) => DestinationSpec[];
        entryOptions: EntryNormalized;
    }): {
        localChunks: Set<StatsChunk>;
        remoteChunks: Set<StatsChunk>;
    };
    apply(compiler: RspackCompiler): void;
    apply(compiler: WebpackCompiler): void;
}
