import webpack from 'webpack';
export declare class RepackLoadScriptRuntimeModule extends webpack.RuntimeModule {
    private chunkId?;
    constructor(chunkId?: string | number | undefined);
    generate(): string;
}
