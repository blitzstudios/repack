import type { LoaderContext } from '@rspack/core';
import { validate } from 'schema-utils';
export interface AssetLoaderRemoteOptions {
    enabled: boolean;
    assetPath?: (args: {
        resourcePath: string;
        resourceFilename: string;
        resourceDirname: string;
        resourceExtensionType: string;
    }) => string;
    publicPath: string;
}
export interface AssetLoaderOptions {
    platform?: string;
    scalableAssetExtensions?: string[];
    scalableAssetResolutions?: string[];
    inline?: boolean;
    publicPath?: string;
    remote?: AssetLoaderRemoteOptions;
}
export interface AssetLoaderContext extends LoaderContext<AssetLoaderOptions> {
}
type Schema = Parameters<typeof validate>[0];
export declare const optionsSchema: Schema;
export declare function getOptions(loaderContext: LoaderContext<AssetLoaderOptions>): AssetLoaderOptions;
export {};
