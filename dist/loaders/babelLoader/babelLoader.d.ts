import { type BabelFileResult, type TransformOptions } from '@babel/core';
import type { LoaderContext } from '@rspack/core';
import type { BabelLoaderOptions, CustomTransformOptions } from './options.js';
export declare const raw = false;
type BabelTransformResult = BabelFileResult & {
    sourceType: 'script' | 'module';
};
export declare const transform: (src: string, transformOptions: TransformOptions, customOptions?: CustomTransformOptions) => Promise<BabelTransformResult>;
export default function babelLoader(this: LoaderContext<BabelLoaderOptions>, source: string, sourceMap: string | undefined): Promise<void>;
export {};
