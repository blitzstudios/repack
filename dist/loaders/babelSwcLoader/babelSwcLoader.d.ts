import type { LoaderContext, SwcLoaderOptions } from '@rspack/core';
import type { BabelSwcLoaderOptions } from './options.js';
type BabelTransform = [string, Record<string, any> | undefined];
export declare const raw = false;
export declare function partitionTransforms(filename: string, babelTransforms: BabelTransform[]): {
    includedSwcTransforms: string[];
    supportedSwcTransforms: string[];
    swcConfig: SwcLoaderOptions;
};
export default function babelSwcLoader(this: LoaderContext<BabelSwcLoaderOptions>, source: string, sourceMap: string | undefined): Promise<void>;
export {};
