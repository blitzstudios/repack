/// <reference types="node" />
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import WebSocket from 'ws';
import { FastifyDevServer } from '../types';
/**
 * Abstract class for providing common logic (eg routing) for all WebSocket servers.
 *
 * @category Development server
 */
export declare abstract class WebSocketServer {
    /** An instance of the underlying WebSocket server. */
    readonly server: WebSocket.Server;
    /** Fastify instance from which {@link server} will receive upgrade connections. */
    protected fastify: FastifyDevServer;
    readonly paths: string[];
    /**
     * Create a new instance of the WebSocketServer.
     * Any logging information, will be passed through standard `fastify.log` API.
     *
     * @param fastify Fastify instance to which the WebSocket will be attached to.
     * @param path Path on which this WebSocketServer will be accepting connections.
     * @param wssOptions WebSocket Server options.
     */
    constructor(fastify: FastifyDevServer, path: string | string[], wssOptions?: Omit<WebSocket.ServerOptions, 'noServer' | 'server' | 'host' | 'port' | 'path'>);
    shouldUpgrade(pathname: string): boolean;
    upgrade(request: IncomingMessage, socket: Socket, head: Buffer): void;
    /**
     * Process incoming WebSocket connection.
     *
     * @param socket Incoming WebSocket connection.
     * @param request Upgrade request for the connection.
     */
    abstract onConnection(socket: WebSocket, request: IncomingMessage): void;
}
