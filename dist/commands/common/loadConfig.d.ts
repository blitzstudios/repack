import type { EnvOptions } from '../../types';
export declare function loadConfig<C extends Record<string, any>>(configFilePath: string, env: EnvOptions): Promise<C>;
