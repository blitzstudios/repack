import type { IncomingMessage } from 'node:http';
import type { Socket } from 'node:net';
import type { FastifyInstance } from 'fastify';
import { type WebSocket, WebSocketServer as WebSocketServerImpl } from 'ws';
import type { WebSocketServerInterface, WebSocketServerOptions } from './types.js';
/**
 * Abstract class for providing common logic (eg routing) for all WebSocket servers.
 *
 * @category Development server
 */
export declare abstract class WebSocketServer<T extends WebSocket = WebSocket> implements WebSocketServerInterface {
    /** An instance of the underlying WebSocket server. */
    protected server: WebSocketServerImpl;
    /** Fastify instance from which {@link server} will receive upgrade connections. */
    protected fastify: FastifyInstance;
    protected name: string;
    protected paths: string[];
    protected clients: Map<string, T>;
    protected nextClientId: number;
    private timer;
    /**
     * Create a new instance of the WebSocketServer.
     * Any logging information, will be passed through standard `fastify.log` API.
     *
     * @param fastify Fastify instance to which the WebSocket will be attached to.
     * @param path Path on which this WebSocketServer will be accepting connections.
     * @param options WebSocketServer options.
     */
    constructor(fastify: FastifyInstance, options: WebSocketServerOptions);
    shouldUpgrade(pathname: string): boolean;
    upgrade(request: IncomingMessage, socket: Socket, head: Buffer): void;
    onConnection(socket: T, _request: IncomingMessage): string;
}
