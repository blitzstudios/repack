import webpack from 'webpack';
import { Rule, WebpackPlugin } from '../../types';
/**
 * {@link JavaScriptLooseModePlugin} configuration options.
 */
export interface JavaScriptLooseModePluginConfig {
    /** Convert to loose mode all modules that match the rule. */
    test: Rule | Rule[];
    /** Convert to loose mode only those modules that match the rule. */
    include: Rule | Rule[];
    /** Exclude all modules that mach the rule from being converted to loose mode. */
    exclude: Rule | Rule[];
}
/**
 * Enable JavaScript loose mode, by removing `use strict` directives from the code.
 * This plugin should only be used for compatibility reasons with Metro, where some libraries
 * might not work in JavaScript Strict mode.
 *
 * @category Webpack Plugin
 */
export declare class JavaScriptLooseModePlugin implements WebpackPlugin {
    private config;
    /**
     * Constructs new `JavaScriptLooseModePlugin`.
     *
     * @param config Plugin configuration options.
     */
    constructor(config: JavaScriptLooseModePluginConfig);
    /**
     * Apply the plugin.
     *
     * @param compiler Webpack compiler instance.
     */
    apply(compiler: webpack.Compiler): void;
}
