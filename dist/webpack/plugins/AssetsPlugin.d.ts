import webpack from 'webpack';
import { WebpackPlugin } from '../../types';
import { AssetResolverConfig } from './AssetsResolverPlugin/AssetResolver';
/**
 * {@link AssetsPlugin} configuration options.
 */
export interface AssetsPluginConfig extends AssetResolverConfig {
    /**
     * Whether the development server is enabled.
     */
    devServerEnabled?: boolean;
    /**
     * Whether `AssetsPlugin` should configure asset loader automatically.
     *
     * Set to `false` if you want to configure it manually, for example if you are using
     * `@svgr/webpack`.
     */
    configureLoader?: boolean;
}
/**
 * Plugin for loading and processing assets (images, audio, video etc) for
 * React Native applications.
 *
 * Assets processing in React Native differs from Web, Node.js or other targets. This plugin allows
 * you to use assets in the same way as you would do when using Metro.
 *
 * @deprecated Use dedicated rule with `@callstack/repack/assets-loader` and `AssetsResolverPlugin`.
 * More information can be found here: https://github.com/callstack/repack/pull/81
 *
 * @category Webpack Plugin
 */
export declare class AssetsPlugin implements WebpackPlugin {
    private config;
    /**
     * Constructs new `AssetsPlugin`.
     *
     * @param config Plugin configuration options.
     */
    constructor(config: AssetsPluginConfig);
    /**
     * Apply the plugin.
     *
     * @param compiler Webpack compiler instance.
     */
    apply(compiler: webpack.Compiler): void;
}
