import type { Compiler, EntryNormalized, ModuleFilenameHelpers, RspackPluginInstance, StatsChunk } from '@rspack/core';
import type { DestinationSpec, OutputPluginConfig } from './types.js';
/**
 * Plugin for copying generated files (bundle, chunks, assets) from Webpack's built location to the
 * React Native application directory, so that the files can be packed together into the `ipa`/`apk`.
 *
 * @category Webpack Plugin
 */
export declare class OutputPlugin implements RspackPluginInstance {
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
    /**
     * Apply the plugin.
     *
     * @param compiler Webpack compiler instance.
     */
    apply(compiler: Compiler): void;
}
