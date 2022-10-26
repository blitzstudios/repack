import { DevServerOptions, Fallback } from '../../../types';
declare type DeepOptional<T> = T extends {
    [key: string]: any;
} ? {
    [K in keyof T]?: DeepOptional<T[K]>;
} : T | undefined;
export declare function getDevServerOptions(options?: Fallback<DeepOptional<DevServerOptions>>): DevServerOptions;
export {};
