import type { IncomingMessage } from 'node:http';
import type { Socket } from 'node:net';
import type { FastifyInstance } from 'fastify';
import type { WebSocketServer } from 'ws';
import type { WebSocketServerInterface } from './types';
export declare class WebSocketServerAdapter implements WebSocketServerInterface {
    private fastify;
    private path;
    private server?;
    constructor(fastify: FastifyInstance, path: string, server?: WebSocketServer | undefined);
    shouldUpgrade(pathname: string): boolean;
    upgrade(request: IncomingMessage, socket: Socket, head: Buffer): void;
}
