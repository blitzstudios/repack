/// <reference types="lodash" />
import type { LogEntry, Reporter } from '../types';
export interface FileReporterConfig {
    filename: string;
}
export declare class FileReporter implements Reporter {
    private config;
    private buffer;
    constructor(config: FileReporterConfig);
    throttledFlush: import("lodash").DebouncedFunc<() => void>;
    process(log: LogEntry): void;
    flush(): void;
    stop(): void;
}
