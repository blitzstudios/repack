/**
 * A helper class to ease the creation of of chunk based on it's location.
 *
 * **You should not need to use this.**
 *
 * @internal
 */
export declare class Chunk {
    /**
     * Creates definition for a chunk hosted on development server.
     *
     * @param chunkId Id of the chunk.
     * @returns Chunk definition.
     */
    static fromDevServer(chunkId: string): string;
    /**
     * Creates definition for a chunk stored on filesystem on the target mobile device.
     *
     * @param chunkId Id of the chunk.
     * @returns Chunk definition.
     */
    static fromFileSystem(chunkId: string): string;
    /**
     * Creates definition for a chunk hosted on a remote server.
     *
     * @param url A URL to remote location where the chunk is stored.
     * @param options Additional options.
     * @returns Chunk definition.
     */
    static fromRemote(url: string, options?: {
        excludeExtension?: boolean;
    }): string;
}
