import type { LogEntry, Reporter } from '../types';
export interface ConsoleReporterConfig {
    asJson?: boolean;
    level?: 'silent' | 'normal' | 'verbose';
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
