import type { LogEntry, Reporter } from '../types.js';
export interface ConsoleReporterConfig {
    asJson?: boolean;
    isVerbose?: boolean;
    isWorker?: boolean;
}
export declare class ConsoleReporter implements Reporter {
    private config;
    private internalReporter;
    constructor(config: ConsoleReporterConfig);
    process(log: LogEntry): void;
    flush(): void;
    stop(): void;
}
