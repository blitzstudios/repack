import type { Compiler, RuntimeModule as RuntimeModuleType } from '@rspack/core';
interface LoadScriptRuntimeModuleConfig {
    chunkId: string | number | undefined;
    hmrEnabled: boolean;
}
export declare const makeLoadScriptRuntimeModule: (compiler: Compiler, moduleConfig: LoadScriptRuntimeModuleConfig) => RuntimeModuleType;
export {};
