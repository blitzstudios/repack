/// <reference types="node" />
import { WebpackDevMiddleware } from 'webpack-dev-middleware';
export declare function readFileFromWdm(wdm: WebpackDevMiddleware, filename: string): Promise<string | Buffer>;
