import execa from 'execa';
import { CliOptions } from '../types';
import { Reporter } from '../Reporter';
import { DevServerReply, DevServerRequest } from './types';
import { BaseDevServer, BaseDevServerConfig } from './BaseDevServer';
import { WebSocketDashboardServer } from './ws/WebSocketDashboardServer';
/**
 * {@link DevServerProxy} configuration options.
 */
export interface DevServerProxyConfig extends BaseDevServerConfig {
}
/**
 * Represents a process that runs Webpack compilation and {@link DevServer}
 * via {@link DevServerPlugin}.
 */
export interface CompilerWorker {
    /** Spawned process with the Webpack compilation. */
    process: execa.ExecaChildProcess;
    /** Port on which {@link DevServer} is running. */
    port: number;
}
/**
 * Class for spawning new compiler workers for each requested platform and forwarding requests
 * to respective platform-specific {@link DevServer}.
 *
 * The overall architecture is:
 * ```
 * `DevServerProxy`
 * ├── <compiler worker platform=ios>
 * │   └── <webpack compilation>
 * │       └── `DevServerPlugin`
 * │           └── `DevServer`
 * ├── <compiler worker platform=android>
 * │   └── <webpack compilation>
 * │       └── `DevServerPlugin`
 * │           └── `DevServer`
 * └── ...
 * ```
 *
 * Each worker is lazy, meaning it will be spawned upon receiving first request from which
 * `platform` can be inferred. This would usually be a request
 * for bundle eg: `index.bundle?platform=ios&...`.
 *
 * @category Development server
 */
export declare class DevServerProxy extends BaseDevServer {
    private cliOptions;
    private static getLoggerOptions;
    /** Platform to worker mappings. */
    workers: Record<string, Promise<CompilerWorker> | undefined>;
    wsDashboardServer: WebSocketDashboardServer;
    /** Reporter instance. */
    reporter: Reporter;
    /**
     * Constructs new `DevServerProxy`.
     *
     * @param config Configuration options.
     * @param cliOptions CLI options (usually provided by {@link start} command based on arguments
     * from React Native CLI.)
     */
    constructor(config: DevServerProxyConfig, cliOptions: CliOptions);
    /**
     * Spawn new compiler worker for given `platform`.
     * If the worker is already running, a warning is emitted and the method stops it's execution.
     * The port on which {@link DevServer} inside worker will be running is random, so no assumptions
     * should be taken regarding the port number.
     *
     * @param platform Application platform for which to spawn new worker.
     */
    runWorker(platform: string): Promise<void>;
    /**
     * Forward request to a {@link DevServer} running inside compiler worker for the `platform`.
     *
     * @param platform Application platform.
     * @param request Request instance to forward.
     * @param reply Reply instance to send received data through.
     */
    forwardRequest(platform: string, request: DevServerRequest, reply: DevServerReply): Promise<void>;
    /**
     * Sets up routes.
     */
    setup(): Promise<void>;
    /**
     * Runs the proxy.
     */
    run(): Promise<void>;
}
