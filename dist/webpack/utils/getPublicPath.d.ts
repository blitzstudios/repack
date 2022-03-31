import { DevServerConfig } from '../../server';
/** {@link getPublicPath} options. */
export interface GetPublicPathOptions extends Pick<DevServerConfig, 'enabled' | 'host' | 'https'> {
    /** Port under which to run the development server. */
    port?: number;
}
/**
 * Get Webpack's public path.
 *
 * @param options Options object.
 * @returns Value for Webpack's `output.publicPath` option.
 *
 * @category Webpack util
 */
export declare function getPublicPath(options: GetPublicPathOptions): string;
