import type { LoaderContext } from '@rspack/core';
import { validate } from 'schema-utils';
/**
 * Note: devServer enabled can be inferred from loader context:
 *       - we can access this.mode & this.hot
 * Note: publicPath could be obtained from webpack config in the future
 */
export interface AssetLoaderOptions {
    platform: string;
    scalableAssetExtensions?: string[];
    scalableAssetResolutions?: string[];
    devServerEnabled?: boolean;
    inline?: boolean;
    publicPath?: string;
    remote?: {
        enabled: boolean;
        assetPath?: (args: {
            resourcePath: string;
            resourceFilename: string;
            resourceDirname: string;
            resourceExtensionType: string;
        }) => string;
        publicPath: string;
    };
}
export interface AssetLoaderContext extends LoaderContext<AssetLoaderOptions> {
}
type Schema = Parameters<typeof validate>[0];
export declare const optionsSchema: Schema;
export declare function getOptions(loaderContext: LoaderContext<AssetLoaderOptions>): AssetLoaderOptions;
export {};
