import type { AssetLoaderRemoteOptions } from '../loaders/assetsLoader/options.js';
/**
 * Interface for {@link getAssetTransformRules} options.
 */
interface GetAssetTransformRulesOptions {
    /**
     * Whether to inline assets as base64 URIs.
     */
    inline?: boolean;
    /**
     * Configuration for remote asset loading.
     */
    remote?: Omit<AssetLoaderRemoteOptions, 'enabled'>;
    /**
     * Determines how SVG files should be processed:
     * - 'svgr': Uses `@svgr/webpack` to transform SVGs into React Native components
     * - 'xml': Loads SVGs as raw XML source to be used with SvgXml from react-native-svg
     * - 'uri': Loads SVGs as inline URIs to be used with SvgUri from react-native-svg
     */
    svg?: 'svgr' | 'xml' | 'uri';
}
/**
 * Creates `module.rules` configuration for handling assets in React Native applications.
 *
 * @param options Configuration options
 * @param options.inline Whether to inline assets as base64 URIs (defaults to false)
 * @param options.remote Configuration for remote asset loading with publicPath and optional assetPath function
 * @param options.svg Determines how SVG files should be processed ('svgr', 'xml', or 'uri')
 *
 * @returns Array of webpack/rspack rules for transforming assets
 */
export declare function getAssetTransformRules({ inline, remote, svg, }?: GetAssetTransformRulesOptions): ({
    test: RegExp;
    use: {
        loader: string;
        options: {
            native: boolean;
        };
    };
    type?: undefined;
} | {
    test: RegExp;
    type: string;
    use?: undefined;
} | {
    test: RegExp;
    use: {
        loader: string;
        options: {
            inline: boolean | undefined;
            remote: {
                publicPath: string;
                assetPath?: ((args: {
                    resourcePath: string;
                    resourceFilename: string;
                    resourceDirname: string;
                    resourceExtensionType: string;
                }) => string) | undefined;
                enabled: boolean;
            } | undefined;
        };
    };
})[];
export {};
