import webpack from 'webpack';
export declare class RepackInitRuntimeModule extends webpack.RuntimeModule {
    private chunkId;
    private globalObject;
    private chunkLoadingGlobal;
    constructor(chunkId: string | number | undefined, globalObject: string, chunkLoadingGlobal: string);
    generate(): string;
}
