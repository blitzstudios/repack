import fs from 'node:fs';
import type { StatsChunk } from '@rspack/core';
export declare class AssetsCopyProcessor {
    readonly config: {
        platform: string;
        outputPath: string;
        bundleOutput: string;
        bundleOutputDir: string;
        sourcemapOutput: string;
        assetsDest: string;
        logger: {
            debug: (...args: string[]) => void;
        };
    };
    private filesystem;
    queue: Array<() => Promise<void>>;
    constructor(config: {
        platform: string;
        outputPath: string;
        bundleOutput: string;
        bundleOutputDir: string;
        sourcemapOutput: string;
        assetsDest: string;
        logger: {
            debug: (...args: string[]) => void;
        };
    }, filesystem?: typeof fs);
    private copyAsset;
    enqueueChunk(chunk: StatsChunk, { isEntry, sourceMapFile }: {
        isEntry: boolean;
        sourceMapFile?: string;
    }): void;
    execute(): Promise<void>[];
}
