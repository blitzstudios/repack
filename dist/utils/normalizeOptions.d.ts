import type { ServerOptions as HttpsServerOptions } from 'node:https';
import type { Options as ProxyOptions } from 'http-proxy-middleware';
import type { Server } from '../types.js';
export interface NormalizedOptions {
    host: string;
    port: number;
    https: HttpsServerOptions | undefined;
    hot: boolean;
    proxy: ProxyOptions[] | undefined;
    url: string;
    disableRequestLogging: boolean;
    rootDir: string;
}
export declare function normalizeOptions(options: Server.Options): NormalizedOptions;
