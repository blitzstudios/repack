export interface ProgressBarOptions {
    width?: number;
    platform?: string;
    unicode?: boolean;
}
export declare const IS_SYMBOL_SUPPORTED: boolean;
export declare function renderProgressBar(percentage: number, { width, platform, unicode, }?: ProgressBarOptions): string;
export declare function colorizePlatformLabel(platform: string, label: string): string;
export declare class Spinner {
    private index;
    getNext(): string;
}
export declare function formatSecondsOneDecimal(ms: number): string;
export declare function formatElapsed(start: number, now: number): string;
export declare function buildInProgressMessageParts(platform: string, percentage: number, options?: {
    width?: number;
    maxPlatformNameWidth?: number;
}): [string, string];
export declare function buildDoneMessageParts(platform: string, timeMs: number, options?: {
    maxPlatformNameWidth?: number;
}): [string, string, string, string];
