import { ChunkConfig, ChunkManagerConfig } from './types';
export declare const DEFAULT_TIMEOUT = 30000;
export declare class ChunkManagerBackend {
    private nativeModule;
    private cache?;
    private resolveRemoteChunk?;
    private storage?;
    private forceRemoteChunkResolution;
    private eventEmitter;
    constructor(nativeModule: any);
    configure(config: ChunkManagerConfig): void;
    private initCache;
    private saveCache;
    resolveChunk(chunkId: string, parentChunkId?: string): Promise<ChunkConfig>;
    loadChunk(chunkId: string, parentChunkId?: string): Promise<void>;
    preloadChunk(chunkId: string, parentChunkId?: string): Promise<void>;
    invalidateChunks(chunksIds?: string[]): Promise<void>;
}
