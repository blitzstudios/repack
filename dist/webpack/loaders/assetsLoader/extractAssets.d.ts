import type { WebpackLogger } from '../../../types';
import type { Asset } from './types';
export declare function extractAssets({ resourcePath, resourceDirname, resourceFilename, resourceExtensionType, assets, suffixPattern, assetsDirname, pathSeparatorRegexp, publicPath: customPublicPath, devServerEnabled, }: {
    resourcePath: string;
    resourceDirname: string;
    resourceFilename: string;
    resourceExtensionType: string;
    assets: Asset[];
    suffixPattern: string;
    assetsDirname: string;
    pathSeparatorRegexp: RegExp;
    publicPath?: string;
    devServerEnabled?: boolean;
}, logger: WebpackLogger): Promise<string>;
