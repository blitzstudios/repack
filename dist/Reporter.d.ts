import { LogEntry, LogType } from './types';
import { WebSocketEventsServer } from './server';
import { WebSocketDashboardServer } from './server/ws/WebSocketDashboardServer';
/**
 * {@link Reporter} configuration options.
 */
export interface ReporterConfig {
    /** Whether to log additional debug messages. */
    verbose?: boolean;
    wsEventsServer?: WebSocketEventsServer;
    wsDashboardServer?: WebSocketDashboardServer;
}
/**
 * Class that handles all reporting, logging and compilation progress handling.
 */
export declare class Reporter {
    private config;
    /**
     * Get message symbol for given log type.
     *
     * @param logType Log type.
     * @returns String with the symbol.
     *
     * @internal
     */
    static getSymbolForType(logType: LogType): string;
    /**
     * Apply ANSI colors to given text.
     *
     * @param logType Log type for the text, based on which different colors will be applied.
     * @param text Text to apply the color onto.
     * @returns Text wrapped in ANSI color sequences.
     *
     * @internal
     */
    static colorizeText(logType: LogType, text: string): string;
    /** Whether reporter is running as a worker. */
    readonly isWorker: boolean;
    /** Whether reporter is running in verbose mode. */
    readonly isVerbose: boolean;
    private ora?;
    private requestBuffer;
    private fileLogBuffer;
    private outputFilename?;
    private progress;
    private logBuffer;
    /**
     * Create new instance of Reporter.
     * If Reporter is running as a non-worker, it will start outputting to terminal.
     *
     * @param config Reporter configuration. Defaults to empty object.
     */
    constructor(config?: ReporterConfig);
    /**
     * Get buffered server logs.
     *
     * @returns Array of server log entries.
     */
    getLogBuffer(): LogEntry[];
    /**
     * Stop reporting and perform cleanup.
     */
    stop(): void;
    /**
     * Enable reporting to file alongside reporting to terminal.
     *
     * @param filename Absolute path to file to which write logs.
     */
    enableFileLogging(filename: string): void;
    /**
     * Flush all buffered logs to a file provided that file
     * reporting was enabled with {@link enableFileLogging}.
     */
    flushFileLogs(): void;
    /**
     * Process new log entry and report it to terminal and file if file reporting was enabled with
     * {@link enableFileLogging}.
     *
     * @param logEntry Log entry to process & report.
     */
    process(logEntry: LogEntry): void;
    private updateProgress;
    private isProgress;
    private transformLogEntry;
    private getOutputLogMessage;
}
