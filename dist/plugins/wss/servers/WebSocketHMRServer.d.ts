import type { IncomingMessage } from 'node:http';
import type { FastifyInstance } from 'fastify';
import type WebSocket from 'ws';
import { WebSocketServer } from '../WebSocketServer';
import type { HmrDelegate } from '../types';
/**
 * Class for creating a WebSocket server for Hot Module Replacement.
 *
 * @category Development server
 */
export declare class WebSocketHMRServer extends WebSocketServer {
    private delegate;
    private clients;
    private nextClientId;
    /**
     * Create new instance of WebSocketHMRServer and attach it to the given Fastify instance.
     * Any logging information, will be passed through standard `fastify.log` API.
     *
     * @param fastify Fastify instance to attach the WebSocket server to.
     * @param delegate HMR delegate instance.
     */
    constructor(fastify: FastifyInstance, delegate: HmrDelegate);
    /**
     * Send action to all connected HMR clients.
     *
     * @param event Event to send to the clients.
     * @param platform Platform of clients to send the event to.
     * @param clientIds Ids of clients who should receive the event.
     */
    send(event: any, platform: string, clientIds?: string[]): void;
    /**
     * Process new WebSocket connection from HMR client.
     *
     * @param socket Incoming HMR client's WebSocket connection.
     */
    onConnection(socket: WebSocket, request: IncomingMessage): void;
}
