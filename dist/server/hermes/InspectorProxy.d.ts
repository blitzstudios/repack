/// <reference types="node" />
import { IncomingMessage } from 'http';
import WebSocket from 'ws';
import { BaseDevServerConfig } from '../BaseDevServer';
import { FastifyDevServer } from '../types';
import { WebSocketServer } from '../ws';
export interface InspectorProxyConfig extends BaseDevServerConfig {
}
export declare class InspectorProxy extends WebSocketServer {
    private config;
    private devices;
    private deviceCounter;
    readonly serverHost: string;
    constructor(fastify: FastifyDevServer, config: InspectorProxyConfig);
    private setup;
    private buildPageDescription;
    /**
     * Process new WebSocket connection from device.
     *
     * @param socket Incoming device's WebSocket connection.
     * @param request Upgrade request for the connection.
     */
    onConnection(socket: WebSocket, request: IncomingMessage): void;
}
