/**
 * Interface for {@link getSwcLoaderOptions} options.
 */
interface MakeSwcLoaderConfigOptions {
    /**
     * The source code syntax type.
     * Use 'js' for JavaScript or 'ts' for TypeScript source files.
     */
    syntax: 'js' | 'ts';
    /**
     * Whether to enable JSX/TSX parsing and transformation.
     */
    jsx: boolean;
    /**
     * Whether to use external helpers for transformations.
     * See SWC `jsc.externalHelpers` documentation:
     * https://swc.rs/docs/configuration/compilation#jscexternalhelpers
     */
    externalHelpers?: boolean;
    /**
     * The JSX runtime to use - 'automatic' for React 17+ new JSX transform or 'classic' for traditional JSX transform.
     * See SWC `jsc.transform.react.runtime`:
     * https://swc.rs/docs/configuration/compilation#jsctransformreactruntime
     */
    jsxRuntime?: 'automatic' | 'classic';
    /**
     * Whether to disable transformation of import/export statements.
     */
    disableImportExportTransform?: boolean;
    /**
     * The source module for JSX runtime imports.
     * See SWC `jsc.transform.react.importSource`:
     * https://swc.rs/docs/configuration/compilation#jsctransformreactimportsource
     */
    importSource?: string;
    /**
     * Enable lazy loading for all imports or specific modules.
     * See SWC `module.lazy`:
     * https://swc.rs/docs/configuration/modules#lazy
     */
    lazyImports?: boolean | string[];
}
/**
 * Creates SWC loader configuration options for React Native bundling.
 *
 * @param options Configuration options for the SWC loader
 * @param options.syntax The source code syntax type ('js' for JavaScript or 'ts' for TypeScript)
 * @param options.jsx Whether to enable JSX parsing and transformation
 * @param options.externalHelpers Whether to use external helpers for transformations (equivalent of `@babel/runtime`)
 * @param options.jsxRuntime The JSX runtime to use ('automatic' for React 17+ new JSX transform or 'classic' for traditional JSX transform)
 * @param options.disableImportExportTransform Whether to disable transformation of import/export statements
 * @param options.importSource The source module for JSX runtime imports (defaults to 'react')
 * @param options.lazyImports Enable lazy loading for all imports or specific modules
 *
 * @returns SWC loader configuration for the React Native target
 */
export declare function getSwcLoaderOptions({ syntax, jsx, externalHelpers, jsxRuntime, disableImportExportTransform, importSource, lazyImports, }: MakeSwcLoaderConfigOptions): {
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
export {};
