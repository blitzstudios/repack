import type { DevServerOptions } from '../../types';
/** {@link getPublicPath} options. */
export interface GetPublicPathOptions {
    /** Target application platform. */
    platform: string;
    /** Development server configuration options. */
    devServer: Pick<DevServerOptions, 'port' | 'host' | 'https'>;
}
/**
 * Get Webpack's public path.
 *
 * @param options Options object.
 * @returns Value for Webpack's `output.publicPath` option.
 *
 * @category Webpack util
 *
 * @example Usage in Webpack config:
 * ```ts
 * import * as Repack from '@callstack/repack';
 *
 * export default (env) => {
 *   const {
 *     platform,
 *     devServer = undefined,
 *   } = env;
 *
 *   return {
 *     output: {
 *       publicPath: Repack.getPublicPath({ platform, devServer }),
 *     },
 *   };
 * };
 * ```
 */
export declare function getPublicPath(options?: GetPublicPathOptions): string;
