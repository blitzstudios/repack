/// <reference types="node" />
import { LoaderContext } from 'webpack';
import { Options } from './options';
import type { ImageSize } from './types';
export declare function getFilesInDirectory(dirname: string, fs: LoaderContext<Options>['fs']): Promise<string[]>;
export declare function getScaleNumber(scaleKey: string): number;
export declare function readFile(filename: string, fs: LoaderContext<Options>['fs']): Promise<string | Buffer>;
export declare function getImageSize({ resourcePath, resourceFilename, suffixPattern, }: {
    resourcePath: string;
    resourceFilename: string;
    suffixPattern: string;
}): ImageSize | undefined;
