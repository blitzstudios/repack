import type { Compiler, RuntimeModule as RuntimeModuleType } from '@rspack/core';
interface InitRuntimeModuleConfig {
    globalObject: string;
}
export declare const makeInitRuntimeModule: (compiler: Compiler, moduleConfig: InitRuntimeModuleConfig) => RuntimeModuleType;
export {};
