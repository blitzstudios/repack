import EventEmitter from 'node:events';
import { Worker } from 'node:worker_threads';
import type { SendProgress } from '@callstack/repack-dev-server';
import type webpack from 'webpack';
import type { Reporter } from '../../logging';
import type { CliOptions } from '../types';
import type { CompilerAsset } from './types';
type Platform = string;
export declare class Compiler extends EventEmitter {
    private cliOptions;
    private reporter;
    workers: Record<Platform, Worker>;
    assetsCache: Record<Platform, Record<string, CompilerAsset>>;
    statsCache: Record<Platform, webpack.StatsCompilation>;
    resolvers: Record<Platform, Array<(error?: Error) => void>>;
    progressSenders: Record<Platform, SendProgress[]>;
    isCompilationInProgress: Record<Platform, boolean>;
    constructor(cliOptions: CliOptions, reporter: Reporter);
    private spawnWorker;
    private addProgressSender;
    private removeProgressSender;
    getAsset(filename: string, platform: string, sendProgress?: SendProgress): Promise<CompilerAsset>;
    getSource(filename: string, platform: string | undefined, sendProgress?: SendProgress): Promise<string | Buffer>;
    getSourceMap(filename: string, platform: string | undefined): Promise<string | Buffer>;
}
export {};
