import type { FastifyInstance } from 'fastify';
import { WebSocketServer } from '../WebSocketServer.js';
/**
 * Class for creating a WebSocket server for Hot Module Replacement.
 *
 * @category Development server
 */
export declare class WebSocketHMRServer extends WebSocketServer {
    /**
     * Create new instance of WebSocketHMRServer and attach it to the given Fastify instance.
     * Any logging information, will be passed through standard `fastify.log` API.
     *
     * @param fastify Fastify instance to attach the WebSocket server to.
     */
    constructor(fastify: FastifyInstance);
    /**
     * Send action to all connected HMR clients.
     *
     * @param event Event to send to the clients.
     */
    send(event: any): void;
}
