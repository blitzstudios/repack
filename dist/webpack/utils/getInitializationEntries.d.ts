/**
 * {@link getInitializationEntries} options.
 */
export interface InitializationEntriesOptions {
    /**
     * Absolute location to JS file with initialization logic for React Native.
     * Useful if you want to built for out-of-tree platforms.
     */
    initializeCoreLocation?: string;
    /**
     * Whether Hot Module Replacement entry should be enabled. Defaults to `true`.
     */
    hmr?: boolean;
}
/**
 * Get setup and initialization entires for Webpack configuration's `entry` field.
 * The returned entires should be added before your project entry.
 *
 * @param reactNativePath Absolute path to directory with React Native dependency.
 * @param options Additional options that can modify returned entires.
 * @returns Array of entires.
 *
 * @category Webpack util
 *
 * @example Usage in Webpack config:
 * ```ts
 * import * as Repack from '@callstack/repack';
 *
 * const { resolve } = createRequire(import.meta.url);
 *
 * export default (env) => {
 *   const {
 *     devServer,
 *     reactNativePath = resolve('react-native'),
 *   } = env;
 *
 *   return {
 *     entry: [
 *       ...Repack.getInitializationEntries(reactNativePath, {
 *         hmr: devServer && devServer.hmr,
 *       }),
 *       entry,
 *     ],
 *   };
 * };
 * ```
 */
export declare function getInitializationEntries(reactNativePath: string, options?: InitializationEntriesOptions): string[];
