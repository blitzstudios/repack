import fs from 'node:fs';
export declare class AuxiliaryAssetsCopyProcessor {
    readonly config: {
        platform: string;
        outputPath: string;
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
        assetsDest: string;
        logger: {
            debug: (...args: string[]) => void;
        };
    }, filesystem?: typeof fs);
    private copyAsset;
    enqueueAsset(asset: string): void;
    execute(): Promise<void>[];
}
