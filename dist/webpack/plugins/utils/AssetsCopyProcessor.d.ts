import fs from 'fs-extra';
import webpack from 'webpack';
import { WebpackLogger } from '../../../types';
export declare class AssetsCopyProcessor {
    readonly config: {
        platform: string;
        compilation: webpack.Compilation;
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
        compilation: webpack.Compilation;
        outputPath: string;
        bundleOutput: string;
        bundleOutputDir: string;
        sourcemapOutput: string;
        assetsDest: string;
        logger: WebpackLogger;
    }, filesystem?: Pick<typeof fs, 'ensureDir' | 'copyFile' | 'readFile' | 'writeFile'>);
    private copyAsset;
    enqueueChunk(chunk: webpack.Chunk, { isEntry }: {
        isEntry: boolean;
    }): void;
    execute(): Promise<void>[];
}
