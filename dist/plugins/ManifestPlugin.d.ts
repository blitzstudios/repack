import type { Compiler, RspackPluginInstance } from '@rspack/core';
/**
 * @category Webpack Plugin
 */
export declare class ManifestPlugin implements RspackPluginInstance {
    /**
     * Apply the plugin.
     *
     * @param compiler Webpack compiler instance.
     */
    apply(compiler: Compiler): void;
}
