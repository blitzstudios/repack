/// <reference types="node" />
import type { LoaderContext } from 'loader-utils';
import type { ImageSize } from './types';
export declare function getFilesInDirectory(dirname: string, fs: LoaderContext['fs']): Promise<string[]>;
export declare function getScaleNumber(scaleKey: string): number;
export declare function readFile(filename: string, fs: LoaderContext['fs']): Promise<string | Buffer>;
export declare function getImageSize({ resourcePath, resourceFilename, suffixPattern, }: {
    resourcePath: string;
    resourceFilename: string;
    suffixPattern: string;
}): ImageSize | undefined;
