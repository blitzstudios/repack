import type { IncomingMessage } from 'node:http';
import type { FastifyInstance } from 'fastify';
import type WebSocket from 'ws';
import { WebSocketServer } from '../WebSocketServer.js';
/**
 * Class for creating a WebSocket server for communication with React Native clients.
 * All client logs - logs from React Native application - are processed here.
 *
 * @category Development server
 */
export declare class WebSocketDevClientServer extends WebSocketServer {
    /**
     * Create new instance of WebSocketDevClientServer and attach it to the given Fastify instance.
     * Any logging information, will be passed through standard `fastify.log` API.
     *
     * @param fastify Fastify instance to attach the WebSocket server to.
     */
    constructor(fastify: FastifyInstance);
    /**
     * Process client message.
     *
     * @param message Stringified client message.
     */
    processMessage(message: string): void;
    onConnection(socket: WebSocket, request: IncomingMessage): string;
}
