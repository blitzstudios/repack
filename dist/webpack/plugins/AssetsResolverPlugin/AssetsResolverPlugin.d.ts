import webpack from 'webpack';
import { WebpackPlugin } from '../../../types';
import { AssetResolverConfig } from './AssetResolver';
/**
 * {@link AssetsResolverPlugin} configuration options.
 */
export interface AssetsResolverPluginConfig extends AssetResolverConfig {
}
/**
 * Plugin for resolving assets (images, audio, video etc) for React Native applications.
 *
 * Assets processing in React Native differs from Web, Node.js or other targets.
 * This plugin in combination with `@callstack/repack/assets-loader` allows
 * you to use assets in the same way as you would do when using Metro.
 *
 * @category Webpack Plugin
 */
export declare class AssetsResolverPlugin implements WebpackPlugin {
    private config;
    /**
     * Constructs new `AssetsResolverPlugin`.
     *
     * @param config Plugin configuration options.
     */
    constructor(config: AssetsResolverPluginConfig);
    /**
     * Apply the plugin.
     *
     * @param compiler Webpack compiler instance.
     */
    apply(compiler: webpack.Compiler): void;
}
