import type { Compiler as RspackCompiler } from '@rspack/core';
import type { Compiler as WebpackCompiler } from 'webpack';
import { type LogEntry, type Reporter } from '../logging/index.js';
export type GenericFilter = Array<string | RegExp>;
/**
 * {@link LoggerPlugin} configuration options.
 */
export interface LoggerPluginConfig {
    /** Logging output config. */
    output?: {
        /** Whether to log to console. */
        console?: boolean;
        /** Absolute path to file to log messages to. */
        file?: string;
        /** Listener for new messages. */
        listener?: (logEntry: LogEntry) => void;
    };
}
/**
 * Logger plugin that handles all logging coming from the Webpack ecosystem,
 * including debug logs from other plugins and resolvers.
 *
 * @category Webpack Plugin
 */
export declare class LoggerPlugin {
    private config;
    private static SUPPORTED_TYPES;
    /** {@link Reporter} instance used to actually writing logs to terminal/file. */
    readonly reporter: Reporter;
    /**
     * Constructs new `LoggerPlugin`.
     *
     * @param config Plugin configuration options.
     */
    constructor(config: LoggerPluginConfig);
    /**
     * Create log entry from Webpack log message from {@link WebpackLogger}.
     *
     * @param issuer Issuer of the message.
     * @param type Type of the message.
     * @param args The body of the message.
     * @param timestamp Timestamp when the message was recorder.
     * @returns Log entry object or undefined when if message is invalid.
     */
    createEntry(issuer: string, type: string, args: any[], timestamp?: number): LogEntry | undefined;
    /**
     * Process log entry and pass it to {@link reporter} instance.
     *
     * @param entry Log entry to process
     */
    processEntry(entry: LogEntry): void;
    apply(compiler: RspackCompiler): void;
    apply(compiler: WebpackCompiler): void;
}
