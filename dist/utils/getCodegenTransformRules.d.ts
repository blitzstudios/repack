/**
 * Returns `module.rules` configuration for handling React Native codegen transformation.
 * This is required for projects using React Native New Architecture.
 *
 * @returns Array of module rules
 */
export declare function getCodegenTransformRules(): {
    type: string;
    test: RegExp;
    use: {
        loader: string;
        options: {
            babelrc: boolean;
            configFile: boolean;
            parserOpts: {
                flow: string;
            };
            plugins: (string | (string | boolean)[])[];
            overrides: {
                test: RegExp;
                plugins: (string | {
                    isTSX: boolean;
                    allowNamespaces: boolean;
                })[][];
            }[];
            sourceMaps: boolean;
        };
    };
}[];
