import type { Asset, AssetDimensions, CollectedScales } from './types';
export declare function getScaleNumber(scaleKey: string): number;
/** Default asset is the one with scale that was originally requested in the loader */
export declare function getDefaultAsset(assets: Asset[]): Asset;
export declare function getAssetDimensions({ resourceData, resourceScale, }: {
    resourceData: Buffer;
    resourceScale: number;
}): AssetDimensions | null;
export declare function collectScales(resourceAbsoluteDirname: string, resourceFilename: string, resourceExtension: string, scalableAssetExtensions: string[], scalableAssetResolutions: string[], readDirAsync: (path: string) => Promise<string[]>): Promise<CollectedScales>;
