import type { FastifyInstance } from 'fastify';
import type { Server } from '../../types';
import { WebSocketRouter } from './WebSocketRouter';
import { WebSocketServerAdapter } from './WebSocketServerAdapter';
import { WebSocketApiServer } from './servers/WebSocketApiServer';
import { WebSocketDebuggerServer } from './servers/WebSocketDebuggerServer';
import { WebSocketDevClientServer } from './servers/WebSocketDevClientServer';
import { WebSocketEventsServer } from './servers/WebSocketEventsServer';
import { WebSocketHMRServer } from './servers/WebSocketHMRServer';
import { WebSocketMessageServer } from './servers/WebSocketMessageServer';
declare module 'fastify' {
    interface FastifyInstance {
        wss: {
            debuggerServer: WebSocketDebuggerServer;
            devClientServer: WebSocketDevClientServer;
            messageServer: WebSocketMessageServer;
            eventsServer: WebSocketEventsServer;
            apiServer: WebSocketApiServer;
            hmrServer: WebSocketHMRServer;
            deviceConnectionServer: WebSocketServerAdapter;
            debuggerConnectionServer: WebSocketServerAdapter;
            router: WebSocketRouter;
        };
    }
}
declare function wssPlugin(instance: FastifyInstance, { options, delegate, }: {
    options: Server.Options;
    delegate: Server.Delegate;
}): Promise<void>;
declare const _default: typeof wssPlugin;
export default _default;
