import type { Asset, AssetDimensions, CollectedScales } from './types.js';
export declare function getScaleNumber(scaleKey: string): number;
export declare function getAssetSize(assets: Asset[]): AssetDimensions | null;
export declare function getAssetDimensions({ resourceData, resourceScale, }: {
    resourceData: Buffer;
    resourceScale: number;
}): AssetDimensions | null;
export declare function collectScales(resourceAbsoluteDirname: string, resourceFilename: string, resourceExtension: string, scalableAssetExtensions: string[], scalableAssetResolutions: string[], platform: string, readDirAsync: (path: string) => Promise<string[]>): Promise<CollectedScales>;
