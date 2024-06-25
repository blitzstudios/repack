import fs from 'fs-extra';
import { WebpackLogger } from '../../../types';
export declare class AuxiliaryAssetsCopyProcessor {
    readonly config: {
        platform: string;
        outputPath: string;
        assetsDest: string;
        logger: WebpackLogger;
    };
    private filesystem;
    queue: Array<() => Promise<void>>;
    constructor(config: {
        platform: string;
        outputPath: string;
        assetsDest: string;
        logger: WebpackLogger;
    }, filesystem?: Pick<typeof fs, 'ensureDir' | 'copyFile' | 'readFile' | 'writeFile'>);
    private copyAsset;
    enqueueAsset(asset: string): void;
    execute(): Promise<void>[];
}
