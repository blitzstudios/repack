import WebSocket from 'ws';
import webpack from 'webpack';
import { FastifyDevServer } from '../types';
import { WebSocketServer } from './WebSocketServer';
/**
 * {@link WebSocketDashboardServer} configuration options.
 */
interface WebSocketDashboardServerConfig {
    /** Instance of Webpack compiler */
    compiler?: webpack.Compiler;
}
/**
 * Class for creating a WebSocket server for Dashboard client.
 * It's used by built-in Dashboard web-app to receive compilation
 * events, logs and other necessary messages.
 *
 * @category Development server
 */
export declare class WebSocketDashboardServer extends WebSocketServer {
    private config?;
    private clients;
    private nextClientId;
    /**
     * Create new instance of WebSocketDashboardServer and attach it to the given Fastify instance.
     * Any logging information, will be passed through standard `fastify.log` API.
     *
     * @param fastify Fastify instance to attach the WebSocket server to.
     */
    constructor(fastify: FastifyDevServer, config?: WebSocketDashboardServerConfig | undefined);
    /**
     * Send message to all connected Dashboard clients.
     *
     * @param message Stringified message to sent.
     */
    send(message: string): void;
    /**
     * Process new WebSocket connection from client application.
     *
     * @param socket Incoming client's WebSocket connection.
     */
    onConnection(socket: WebSocket): void;
}
export {};
