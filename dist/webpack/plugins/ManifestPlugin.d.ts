import webpack from 'webpack';
import type { WebpackPlugin } from '../../types';
/**
 * @category Webpack Plugin
 */
export declare class ManifestPlugin implements WebpackPlugin {
    /**
     * Apply the plugin.
     *
     * @param compiler Webpack compiler instance.
     */
    apply(compiler: webpack.Compiler): void;
}
