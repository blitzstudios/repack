import type { LoaderContext } from '@rspack/core';
import { validate } from 'schema-utils';
export interface FlowLoaderOptions {
    all?: boolean;
    ignoreUninitializedFields?: boolean;
    pretty?: true;
}
type Schema = Parameters<typeof validate>[0];
export declare const optionsSchema: Schema;
export declare function getOptions(loaderContext: LoaderContext<FlowLoaderOptions>): FlowLoaderOptions;
export {};
