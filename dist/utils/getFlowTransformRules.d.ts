/**
 * Interface for {@link getFlowTransformRules} options.
 */
interface GetFlowTransformRulesOptions {
    /**
     * Array of module names to include for Flow transformation.
     * Pass module names as they appear in package.json.
     * You can use full package names or scopes.
     */
    include?: string[];
    /**
     * Array of module names to exclude from Flow transformation.
     * Pass module names as they appear in package.json.
     * You can use full package names or scopes.
     */
    exclude?: string[];
    /**
     * Whether to bypass looking for @flow pragma comment before parsing.
     */
    all?: boolean;
    /**
     * Whether to remove uninitialized class fields completely
     * rather than only removing the type.
     */
    ignoreUninitializedFields?: boolean;
}
/**
 * Creates rules configuration for handling Flow type annotations in JavaScript files.
 * The rules will use flow-loader to remove Flow types from the code before other processing.
 *
 * @param options Configuration options
 * @param options.include Array of module names to include for Flow transformation (defaults to predefined FLOW_TYPED_MODULES)
 * @param options.exclude Array of module names to exclude from Flow transformation (defaults to empty array)
 * @param options.all If true, bypasses looking for @flow pragma comment before parsing (defaults to true)
 * @param options.ignoreUninitializedFields If true, removes uninitialized class fields completely rather than only removing the type (defaults to false)
 *
 * @returns Array of rules for transforming Flow typed modules
 */
export declare function getFlowTransformRules({ include, exclude, all, ignoreUninitializedFields, }?: GetFlowTransformRulesOptions): {
    type: string;
    test: RegExp;
    include: RegExp[];
    exclude: RegExp[];
    use: {
        loader: string;
        options: {
            all: boolean;
            ignoreUninitializedFields: boolean;
        };
    };
}[];
export {};
