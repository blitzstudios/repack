import webpack from 'webpack';
interface RepackInitRuntimeModuleConfig {
    chunkId: string | number | undefined;
    globalObject: string;
    chunkLoadingGlobal: string;
    hmrEnabled?: boolean;
}
export declare class RepackInitRuntimeModule extends webpack.RuntimeModule {
    private config;
    constructor(config: RepackInitRuntimeModuleConfig);
    generate(): string;
}
export {};
