import type { Asset } from './types';
export declare function convertToRemoteAssets({ assets, assetsDirname, remotePublicPath, resourceDirname, resourceExtensionType, resourceFilename, resourcePath, suffixPattern, pathSeparatorRegexp, }: {
    assets: Asset[];
    assetsDirname: string;
    remotePublicPath: string;
    resourceDirname: string;
    resourceExtensionType: string;
    resourceFilename: string;
    resourcePath: string;
    suffixPattern: string;
    pathSeparatorRegexp: RegExp;
}): string;
