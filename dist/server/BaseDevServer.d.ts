import { DevServerOptions } from '../types';
import { DevServerLoggerOptions, FastifyDevServer } from './types';
import { WebSocketDebuggerServer, WebSocketMessageServer, WebSocketEventsServer, WebSocketDevClientServer } from './ws';
import { WebSocketRouter } from './ws/WebSocketRouter';
/**
 * {@link BaseDevServer} configuration options.
 */
export interface BaseDevServerConfig extends DevServerOptions {
    /** Context in which all resolution happens. Usually it's project root directory. */
    context: string;
    /** Target application platform. */
    platform: string;
}
/**
 * Base class for all Fastify-based servers.
 * It handles creation of a Fastify instance, creation of all WebSocket servers and running Fastify.
 *
 * @category Development server
 */
export declare class BaseDevServer {
    /** Configuration options. */
    protected config: BaseDevServerConfig;
    /** Fastify instance. */
    fastify: FastifyDevServer;
    /** WebSocket router instance. */
    wsRouter: WebSocketRouter;
    /** Debugger server instance. */
    wsDebuggerServer: WebSocketDebuggerServer;
    /** Message server instance. */
    wsMessageServer: WebSocketMessageServer;
    /** Events server instance. */
    wsEventsServer: WebSocketEventsServer;
    /** Server instance for React Native clients. */
    wsClientServer: WebSocketDevClientServer;
    /**
     * Constructs new `BaseDevServer` instance.
     *
     * @param config Configuration options.
     * @param loggerOptions Logger options.
     */
    constructor(config: BaseDevServerConfig, loggerOptions?: DevServerLoggerOptions);
    /**
     * Sets up common routes.
     *
     * All classes that implements {@link BaseDevServer} should call this method before
     * calling {@link run}.
     */
    setup(): Promise<void>;
    /**
     * Runs Fastify and listens on port and host specified in constructor.
     */
    run(): Promise<void>;
}
