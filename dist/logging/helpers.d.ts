import type { LogEntry, Reporter } from './types.js';
export declare function makeLogEntryFromFastifyLog(data: any): LogEntry;
export declare function composeReporters(reporters: Reporter[]): Reporter;
