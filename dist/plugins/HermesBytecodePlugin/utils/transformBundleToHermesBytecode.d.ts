interface TransformBundleToHermesBytecodeOptions {
    /** Path to the Hermes compiler binary. */
    hermesCLIPath: string;
    /** Whether to generate source maps. */
    useSourceMaps: boolean;
    /** Path to the bundle to be transformed. */
    bundlePath: string;
}
/**
 * Transforms a bundle to Hermes bytecode.
 *
 * Logic based on implementations for each platform.
 * - iOS: [react-native-xcode.sh](https://github.com/facebook/react-native/blob/f38fc9ba8681622f7cfdb586753e50c596946929/packages/react-native/scripts/react-native-xcode.sh#L166-L187)
 * - Android: [BundleHermesCTask.kt](https://github.com/facebook/react-native/blob/f38fc9ba8681622f7cfdb586753e50c596946929/packages/react-native-gradle-plugin/src/main/kotlin/com/facebook/react/tasks/BundleHermesCTask.kt#L93-L111) (with defaults in [ReactExtension.kt](https://github.com/facebook/react-native/blob/f38fc9ba8681622f7cfdb586753e50c596946929/packages/react-native-gradle-plugin/src/main/kotlin/com/facebook/react/ReactExtension.kt#L116-L117))
 */
export declare const transformBundleToHermesBytecode: ({ hermesCLIPath, useSourceMaps, bundlePath, }: TransformBundleToHermesBytecodeOptions) => Promise<{
    sourceMap: string;
}>;
export {};
