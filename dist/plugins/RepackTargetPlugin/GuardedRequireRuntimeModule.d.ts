import type { Compiler, RuntimeModule as RuntimeModuleType } from '@rspack/core';
interface GuardedRequireRuntimeModuleConfig {
    globalObject: string;
}
export declare const makeGuardedRequireRuntimeModule: (compiler: Compiler, moduleConfig: GuardedRequireRuntimeModuleConfig) => RuntimeModuleType;
export {};
