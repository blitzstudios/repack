import type { ServerOptions as HttpsServerOptions } from 'node:https';
import type * as DevMiddleware from '@react-native/dev-middleware';
import type { Options as ProxyOptions } from 'http-proxy-middleware';
import type { Server, SetupMiddlewaresFunction } from '../types.js';
export interface NormalizedOptions {
    host: string;
    port: number;
    https: HttpsServerOptions | undefined;
    hot: boolean;
    proxy: ProxyOptions[] | undefined;
    url: string;
    disableRequestLogging: boolean;
    devMiddleware: typeof DevMiddleware;
    rootDir: string;
    setupMiddlewares: SetupMiddlewaresFunction;
}
export declare function normalizeOptions(options: Server.Options): NormalizedOptions;
