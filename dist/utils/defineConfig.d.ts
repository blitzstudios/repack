import type { DevServerOptions } from '@callstack/repack-dev-server';
import type { Configuration as RspackConfiguration } from '@rspack/core';
import type { Configuration as WebpackConfiguration } from 'webpack';
import type { EnvOptions } from '../types.js';
export interface RepackRspackConfig extends RspackConfiguration {
    devServer?: DevServerOptions;
}
export type RepackRspackConfigFn = (env: EnvOptions) => RepackRspackConfig;
export type RepackRspackConfigAsyncFn = (env: EnvOptions) => Promise<RepackRspackConfig>;
export type RepackRspackConfigExport = RepackRspackConfig | RepackRspackConfigFn | RepackRspackConfigAsyncFn;
export interface RepackWebpackConfig extends WebpackConfiguration {
    devServer?: DevServerOptions;
}
export type RepackWebpackConfigFn = (env: EnvOptions) => RepackWebpackConfig;
export type RepackWebpackConfigAsyncFn = (env: EnvOptions) => Promise<RepackWebpackConfig>;
export type RepackWebpackConfigExport = RepackWebpackConfig | RepackWebpackConfigFn | RepackWebpackConfigAsyncFn;
export declare function defineRspackConfig(config: RepackRspackConfig): RepackRspackConfig;
export declare function defineRspackConfig(config: RepackRspackConfigFn): RepackRspackConfigFn;
export declare function defineRspackConfig(config: RepackRspackConfigAsyncFn): RepackRspackConfigAsyncFn;
export declare function defineRspackConfig(config: RepackRspackConfigExport): RepackRspackConfigExport;
export declare function defineWebpackConfig(config: RepackWebpackConfig): RepackWebpackConfig;
export declare function defineWebpackConfig(config: RepackWebpackConfigFn): RepackWebpackConfigFn;
export declare function defineWebpackConfig(config: RepackWebpackConfigAsyncFn): RepackWebpackConfigAsyncFn;
export declare function defineWebpackConfig(config: RepackWebpackConfigExport): RepackWebpackConfigExport;
