import webpack from 'webpack';
import type { DevServerOptions, WebpackPlugin } from '../../types';
/**
 * {@link ReactRefreshPlugin} configuration options.
 */
export interface ReactRefreshPluginConfig extends DevServerOptions {
    platform: string;
}
/**
 * Class for setting up Hot Module Replacement and React Refresh support using `@pmmmwh/react-refresh-webpack-plugin`.
 *
 * @category Webpack Plugin
 */
export declare class ReactRefreshPlugin implements WebpackPlugin {
    private config?;
    /**
     * Constructs new `ReactRefreshPlugin`.
     *
     * @param config Plugin configuration options.
     */
    constructor(config?: ReactRefreshPluginConfig | undefined);
    /**
     * Apply the plugin.
     *
     * @param compiler Webpack compiler instance.
     */
    apply(compiler: webpack.Compiler): void;
}
