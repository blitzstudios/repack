import type { ConsoleReporterConfig, FileReporterConfig, LogEntry, Reporter } from './types.js';
export declare class ConsoleReporter implements Reporter {
    private config;
    private internalReporter;
    constructor(config: ConsoleReporterConfig);
    process(log: LogEntry): void;
    flush(): void;
    stop(): void;
}
export declare class FileReporter implements Reporter {
    private config;
    private buffer;
    constructor(config: FileReporterConfig);
    throttledFlush: () => void;
    process(log: LogEntry): void;
    flush(): void;
    stop(): void;
}
