import { validateSchema } from 'webpack';
import { LoaderContext } from 'loader-utils';
export interface Options {
    platform: string;
    scalableAssetExtensions: string[];
    devServerEnabled?: boolean;
    inline?: boolean;
    publicPath?: string;
    remote?: {
        enabled: boolean;
        publicPath: string;
    };
}
declare type Schema = Parameters<typeof validateSchema>[0];
export declare const optionsSchema: Schema;
export declare function getOptions(loaderContext: LoaderContext): Options;
export {};
