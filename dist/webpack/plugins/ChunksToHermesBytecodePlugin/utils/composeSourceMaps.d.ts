/**
 * {@link composeSourceMaps} options.
 */
interface ComposeSourceMapsOptions {
    /** Path to the React Native root directory. */
    reactNativePath: string;
    /**
     * Path to the source map generated by webpack-bundle.
     *
     * This will be replaced with the composed source map.
     */
    packagerMapPath: string;
    /** Path to React-Native package inside node_modules. */
    compilerMapPath: string;
}
/**
 * Composes source maps generated by webpack-bundle and Hermes.
 *
 * Removes original source map files.
 */
export declare const composeSourceMaps: ({ reactNativePath, packagerMapPath, compilerMapPath, }: ComposeSourceMapsOptions) => Promise<void>;
export {};
