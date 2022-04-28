import { WebpackDevMiddleware } from 'webpack-dev-middleware';
import webpack from 'webpack';
import { Symbolicator } from './Symbolicator';
import { BaseDevServer, BaseDevServerConfig } from './BaseDevServer';
import { WebSocketHMRServer } from './ws';
import { WebSocketDashboardServer } from './ws/WebSocketDashboardServer';
/**
 * {@link DevServer} configuration options.
 */
export interface DevServerConfig extends BaseDevServerConfig {
}
/**
 * Class for setting up and running development server for React Native application.
 * It's usually created by the {@link DevServerPlugin}.
 *
 * Each `DevServer` instance is platform-specific, for example for `ios` and `android` platforms,
 * you need 2 `DevServer` running (on different ports). Alternatively you can
 * use {@link DevServerProxy} to spawn new processes with Webpack compilations for each platform.
 *
 * @category Development server
 */
export declare class DevServer extends BaseDevServer {
    private compiler;
    private static getLoggerOptions;
    /** [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) instance. */
    wdm: WebpackDevMiddleware;
    /** HMR WebSocket server instance to allow HMR clients to receive updates. */
    hmrServer: WebSocketHMRServer;
    /** Dashboard WebSocket server instance to provide events to dashboard web client. */
    wsDashboardServer: WebSocketDashboardServer;
    /** Symbolicator instance to transform stack traces using Source Maps. */
    symbolicator: Symbolicator;
    /**
     * Constructs new `DevServer` instance.
     *
     * @param config Configuration options.
     * @param compiler Webpack compiler instance.
     */
    constructor(config: DevServerConfig, compiler: webpack.Compiler);
    /**
     * Sets up Fastify plugins and routes.
     */
    setup(): Promise<void>;
    /**
     * Runs development server.
     */
    run(): Promise<void>;
}
