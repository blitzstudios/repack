import type { Configuration as RspackConfiguration } from '@rspack/core';
import type { Configuration as WebpackConfiguration } from 'webpack';
type RspackCacheOptions = NonNullable<RspackConfiguration['experiments']>['cache'];
type WebpackCacheOptions = WebpackConfiguration['cache'];
export declare function resetPersistentCache(config: {
    bundler: 'rspack';
    rootDir: string;
    cacheConfigs: RspackCacheOptions[];
}): void;
export declare function resetPersistentCache(config: {
    bundler: 'webpack';
    rootDir: string;
    cacheConfigs: WebpackCacheOptions[];
}): void;
export {};
