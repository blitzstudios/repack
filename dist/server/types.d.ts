/// <reference types="node" />
import { Server } from 'http';
import { Http2SecureServer, Http2ServerRequest, Http2ServerResponse } from 'http2';
import { Writable } from 'stream';
import { FastifyInstance, FastifyLoggerOptions, FastifyReply, FastifyRequest, onSendHookHandler } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
export declare type FastifyDevServer = FastifyInstance<Http2SecureServer | Server, Http2ServerRequest, Http2ServerResponse>;
export declare type DevServerRequest = FastifyRequest<RouteGenericInterface, Server | Http2SecureServer, Http2ServerRequest>;
export declare type DevServerReply = FastifyReply<Server | Http2SecureServer, Http2ServerRequest, Http2ServerResponse, RouteGenericInterface, unknown>;
export declare type OnSendHookHandler<T> = onSendHookHandler<T, Http2SecureServer | Server, Http2ServerRequest, Http2ServerResponse>;
/**
 * Development server logging configuration.
 * Apart from 'stream' all other fields come from Fastify types.
 */
export interface DevServerLoggerOptions extends FastifyLoggerOptions {
    /** Stream to write logs to. */
    stream?: Writable;
}
