import type { Compiler as RspackCompiler } from '@rspack/core';
import type { Compiler as WebpackCompiler } from 'webpack';
export declare function isRspackCompiler(compiler: RspackCompiler | WebpackCompiler): boolean;
export declare function isTruthyEnv(env: string | undefined): boolean;
export declare function adaptFilenameToPlatform(filename: string): string;
interface MoveElementBeforeConfig<T> {
    beforeElement: string | RegExp;
    elementToMove: string | RegExp;
    getElement?: (item: T) => string;
}
export declare function moveElementBefore<T>(array: T[], { beforeElement, elementToMove, getElement, }: MoveElementBeforeConfig<T>): void;
export {};
