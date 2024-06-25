import fs from 'fs-extra';
import webpack from 'webpack';
import { WebpackLogger } from '../../../types';
export declare class AssetsCopyProcessor {
    readonly config: {
        platform: string;
        outputPath: string;
        bundleOutput: string;
        bundleOutputDir: string;
        sourcemapOutput: string;
        assetsDest: string;
        logger: WebpackLogger;
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
        logger: WebpackLogger;
    }, filesystem?: Pick<typeof fs, 'ensureDir' | 'copyFile' | 'readFile' | 'writeFile'>);
    private copyAsset;
    enqueueChunk(chunk: webpack.StatsChunk, { isEntry, sourceMapFile }: {
        isEntry: boolean;
        sourceMapFile?: string;
    }): void;
    execute(): Promise<void>[];
}
