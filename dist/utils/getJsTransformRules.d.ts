/**
 * Interface for {@link getJsTransformRules} options.
 */
interface GetJsTransformRulesOptions {
    /** Configuration options for SWC transformations */
    swc?: {
        /** Whether to disable transformation of import/export statements */
        disableImportExportTransform?: boolean;
        /** Whether to use external helpers for transformations (equivalent of `@babel/runtime`) */
        externalHelpers?: boolean;
        /** The source module for JSX runtime imports (defaults to 'react') */
        importSource?: string;
        /** The JSX runtime to use ('automatic' for React 17+ new JSX transform or 'classic' for traditional JSX transform) */
        jsxRuntime?: 'automatic' | 'classic';
        /** Enable lazy loading for all imports or specific modules */
        lazyImports?: boolean | string[];
    };
    /** Configuration for enabling/disabling Flow transformations */
    flow?: {
        /** Whether to enable Flow transformations in the JavaScript transform pipeline */
        enabled?: boolean;
        /** Array of module names to include for Flow transformation */
        include?: string[];
        /** Array of module names to exclude from Flow transformation */
        exclude?: string[];
        /** If true, bypasses looking for @flow pragma comment before parsing */
        all?: boolean;
        /** If true, removes uninitialized class fields completely rather than only removing the type */
        ignoreUninitializedFields?: boolean;
        /** If true, removes empty import statements which were only used for importing flow types */
        removeEmptyImports?: boolean;
    };
    /** Configuration for enabling/disabling codegen transformations */
    codegen?: {
        /** Whether to enable codegen transformations in the JavaScript transform pipeline */
        enabled?: boolean;
    };
}
/**
 * Generates Rspack `module.rules` configuration for transforming JavaScript, TypeScript, and Flow files.
 * It combines SWC loader configuration for JS/TS files with Flow and codegen transformations.
 * You can consider it an equivalent of `@react-native/babel-preset`, but for SWC.
 *
 * @param options Configuration options for JavaScript/TypeScript transformations
 * @param options.swc Configuration options for SWC transformations
 * @param options.flow Configuration for enabling/disabling Flow transformations
 * @param options.codegen Configuration for enabling/disabling codegen transformations
 *
 * @returns Array of Rspack module rules for transforming JavaScript, TypeScript and Flow files
 */
export declare function getJsTransformRules(options?: GetJsTransformRulesOptions): ({
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
} | {
    type: string;
    test: RegExp;
    include: RegExp[];
    exclude: RegExp[];
    use: {
        loader: string;
        options: {
            all: boolean;
            ignoreUninitializedFields: boolean;
            removeEmptyImports: boolean;
        };
    };
} | {
    type: string;
    test: RegExp;
    oneOf: {
        test: RegExp;
        use: {
            loader: string;
            options: {
                env: {
                    targets: {
                        node: number;
                    };
                    include: string[];
                };
                jsc: {
                    assumptions: {
                        setPublicClassFields: boolean;
                        privateFieldsAsProperties: boolean;
                    };
                    externalHelpers: boolean;
                    parser: {
                        syntax: string;
                        jsx: boolean;
                        exportDefaultFrom: boolean;
                        tsx?: undefined;
                    } | {
                        syntax: string;
                        tsx: boolean;
                        jsx?: undefined;
                        exportDefaultFrom?: undefined;
                    };
                    transform: {
                        react: {
                            runtime: "automatic" | "classic";
                            development: boolean;
                            importSource: string;
                        };
                    };
                };
                module: {
                    type: string;
                    strict: boolean;
                    strictMode: boolean;
                    noInterop: boolean;
                    lazy: boolean | string[];
                    allowTopLevelThis: boolean;
                    ignoreDynamic: boolean;
                } | undefined;
            };
        };
    }[];
})[];
export {};
