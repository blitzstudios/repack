import WebSocket from 'ws';
import webpack from 'webpack';
import { FastifyDevServer } from '../types';
import { HMRMessage } from '../../types';
import { WebSocketServer } from './WebSocketServer';
/**
 * {@link WebSocketHMRServer} configuration options.
 */
export interface WebSocketHMRServerConfig {
    /** Instance of Webpack compiler */
    compiler: webpack.Compiler;
}
/**
 * Class for creating a WebSocket server for Hot Module Replacement.
 *
 * @category Development server
 */
export declare class WebSocketHMRServer extends WebSocketServer {
    private config;
    private latestStats?;
    private clients;
    private nextClientId;
    /**
     * Create new instance of WebSocketHMRServer and attach it to the given Fastify instance.
     * Any logging information, will be passed through standard `fastify.log` API.
     *
     * @param fastify Fastify instance to attach the WebSocket server to.
     */
    constructor(fastify: FastifyDevServer, config: WebSocketHMRServerConfig);
    /**
     * Send action to all connected HMR clients.
     *
     * @param action Action to send to the clients.
     */
    sendAction(action: HMRMessage['action']): void;
    /**
     * Process new WebSocket connection from HMR client.
     *
     * @param socket Incoming HMR client's WebSocket connection.
     */
    onConnection(socket: WebSocket): void;
}
