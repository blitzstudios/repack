import type { Asset } from './types.js';
export declare function extractAssets({ resourcePath, resourceDirname, resourceFilename, resourceExtensionType, assets, assetsDirname, pathSeparatorRegexp, publicPath: customPublicPath, isDev, }: {
    resourcePath: string;
    resourceDirname: string;
    resourceFilename: string;
    resourceExtensionType: string;
    assets: Asset[];
    suffixPattern: string;
    assetsDirname: string;
    pathSeparatorRegexp: RegExp;
    publicPath?: string;
    isDev?: boolean;
}, logger: {
    debug: (...args: string[]) => void;
}): string;
