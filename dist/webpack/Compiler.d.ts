/// <reference types="node" />
import { Worker } from 'worker_threads';
import EventEmitter from 'events';
import webpack from 'webpack';
import { SendProgress } from '@callstack/repack-dev-server';
import type { CliOptions } from '../types';
import type { Reporter } from '../logging';
export interface Asset {
    data: string | Buffer;
    info: Record<string, any>;
}
declare type Platform = string;
export declare class Compiler extends EventEmitter {
    private cliOptions;
    private reporter;
    private isVerbose?;
    workers: Record<Platform, Worker>;
    assetsCache: Record<Platform, Record<string, Asset>>;
    statsCache: Record<Platform, webpack.StatsCompilation>;
    resolvers: Record<Platform, Array<(error?: Error) => void>>;
    progressSenders: Record<Platform, SendProgress[]>;
    isCompilationInProgress: Record<Platform, boolean>;
    constructor(cliOptions: CliOptions, reporter: Reporter, isVerbose?: boolean | undefined);
    private spawnWorker;
    getAsset(filename: string, platform: string, sendProgress?: SendProgress): Promise<Asset>;
    getSource(filename: string, platform?: string): Promise<string | Buffer>;
    getSourceMap(filename: string, platform: string): Promise<string | Buffer>;
    getMimeType(filename: string): string;
}
export {};
