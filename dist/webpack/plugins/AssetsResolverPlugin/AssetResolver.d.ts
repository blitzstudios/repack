import webpack, { Resolver } from 'webpack';
/**
 * {@link AssetResolver} configuration options.
 */
export interface AssetResolverConfig {
    /**
     * Override default asset extensions. If the asset matches one of the extensions, it will be process
     * by the custom React Native asset resolver. Otherwise, the resolution will process normally and
     * the asset will be handled by Webpack.
     */
    extensions?: string[];
    /**
     * Override default scalable extensions, which processes only scalable assets like images
     * to create a map of DPI variants of the asset.
     */
    scalableExtensions?: string[];
    /** Target application platform. */
    platform: string;
}
export interface CollectedScales {
    [key: string]: {
        platform: string;
        name: string;
    };
}
interface CollectOptions {
    name: string;
    platform: string;
    type: string;
}
export declare class AssetResolver {
    readonly config: AssetResolverConfig;
    private compiler;
    static collectScales(scalableAssetExtensions: string[], files: string[], { name, type, platform }: CollectOptions): CollectedScales;
    constructor(config: AssetResolverConfig, compiler: webpack.Compiler);
    apply(resolver: Resolver): void;
}
export {};
