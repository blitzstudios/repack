import EventEmitter from 'node:events';
import { Worker } from 'node:worker_threads';
import type { SendProgress } from '@callstack/repack-dev-server';
import type webpack from 'webpack';
import type { Reporter } from '../../logging/types.js';
import type { StartArguments } from '../types.js';
import type { CompilerAsset } from './types.js';
type Platform = string;
export declare class Compiler extends EventEmitter {
    private args;
    private reporter;
    private rootDir;
    private reactNativePath;
    workers: Record<Platform, Worker>;
    assetsCache: Record<Platform, Record<string, CompilerAsset>>;
    statsCache: Record<Platform, webpack.StatsCompilation>;
    resolvers: Record<Platform, Array<(error?: Error) => void>>;
    progressSenders: Record<Platform, SendProgress[]>;
    isCompilationInProgress: Record<Platform, boolean>;
    constructor(args: StartArguments, reporter: Reporter, rootDir: string, reactNativePath: string);
    private spawnWorker;
    private addProgressSender;
    private removeProgressSender;
    getAsset(filename: string, platform: string, sendProgress?: SendProgress): Promise<CompilerAsset>;
    getSource(filename: string, platform: string | undefined, sendProgress?: SendProgress): Promise<string | Buffer>;
    getSourceMap(filename: string, platform: string | undefined): Promise<string | Buffer>;
}
export {};
