import type { ParseResult } from '@babel/core';
interface HermesParser {
    parse: (src: string, opts: {
        babel: boolean;
        flow?: 'all' | 'detect';
        reactRuntimeTarget: string;
        sourceType: 'script' | 'module' | 'unambiguous' | null | undefined;
    }) => ParseResult;
}
export declare function isTypeScriptSource(fileName: string): boolean;
export declare function isTSXSource(fileName: string): boolean;
export declare function loadHermesParser(projectRoot?: string | null, providedHermesParserPath?: string): Promise<HermesParser>;
export declare function isIgnoredRepackDeepImport(filename: string): boolean;
export {};
