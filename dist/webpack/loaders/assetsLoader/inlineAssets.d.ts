import type { Asset } from './types';
export declare function inlineAssets({ assets, resourcePath, resourceFilename, suffixPattern, }: {
    assets: Asset[];
    resourcePath: string;
    resourceFilename: string;
    suffixPattern: string;
}): string;
