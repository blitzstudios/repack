import type { Compiler, RspackPluginInstance } from '@rspack/core';
import { type LoggerPluginConfig } from './LoggerPlugin.js';
import { type OutputPluginConfig } from './OutputPlugin/index.js';
/**
 * {@link RepackPlugin} configuration options.
 */
export interface RepackPluginConfig {
    /** Target application platform. */
    platform?: string;
    /**
     * Options to configure {@link LoggerPlugin}'s `output`.
     *
     * Setting this to `false` disables {@link LoggerPlugin}.
     */
    logger?: LoggerPluginConfig['output'] | boolean;
    /**
     * Output options specifying where to save generated bundle, source map and assets.
     *
     * Refer to {@link OutputPluginConfig.output} for more details.
     */
    output?: OutputPluginConfig['output'];
    /**
     * Absolute location to JS file with initialization logic for React Native.
     * Useful if you want to built for out-of-tree platforms.
     */
    initializeCore?: string;
    /**
     * Options specifying how to deal with extra chunks generated in the compilation,
     * usually by using dynamic `import(...)` function.
     *
     * Refer to {@link OutputPluginConfig.extraChunks} for more details.
     */
    extraChunks?: OutputPluginConfig['extraChunks'];
    listenerIP?: string;
}
/**
 * Webpack plugin, which abstracts configuration of other Re.Pack's plugin
 * to make Webpack config more readable.
 *
 * @example Usage in Webpack config (ESM):
 * ```ts
 * import * as Repack from '@callstack/repack';
 *
 * export default (env) => {
 *   const {
 *     mode = 'development',
 *     platform,
 *   } = env;
 *
 *   return {
 *     plugins: [
 *       new Repack.RepackPlugin({
 *         platform,
 *       }),
 *     ],
 *   };
 * };
 * ```
 *
 * Internally, `RepackPlugin` configures the following plugins:
 * - `webpack.DefinePlugin` with `__DEV__` global
 * - {@link AssetsResolverPlugin}
 * - {@link OutputPlugin}
 * - {@link DevelopmentPlugin}
 * - {@link RepackTargetPlugin}
 * - `webpack.SourceMapDevToolPlugin`
 * - {@link LoggerPlugin}
 *
 * `RepackPlugin` provides a sensible defaults, but can be customized to some extent.
 * If you need more control, it's recommended to remove `RepackPlugin` and use other plugins
 * directly, eg:
 * ```ts
 * import * as Repack from '@callstack/repack';
 *
 * new Repack.plugins.AssetsResolverPlugin();
 * ```
 *
 * @category Webpack Plugin
 */
export declare class RepackPlugin implements RspackPluginInstance {
    private config;
    constructor(config?: RepackPluginConfig);
    apply(compiler: Compiler): void;
}
