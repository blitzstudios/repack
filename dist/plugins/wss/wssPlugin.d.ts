import type { FastifyInstance } from 'fastify';
import type { WebSocketServer } from 'ws';
import type { Server } from '../../types.js';
import { WebSocketRouter } from './WebSocketRouter.js';
import { WebSocketServerAdapter } from './WebSocketServerAdapter.js';
import { WebSocketApiServer } from './servers/WebSocketApiServer.js';
import { WebSocketDevClientServer } from './servers/WebSocketDevClientServer.js';
import { WebSocketEventsServer } from './servers/WebSocketEventsServer.js';
import { WebSocketHMRServer } from './servers/WebSocketHMRServer.js';
import { WebSocketMessageServer } from './servers/WebSocketMessageServer.js';
declare module 'fastify' {
    interface FastifyInstance {
        wss: {
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
declare module 'ws' {
    interface WebSocket {
        isAlive?: boolean;
    }
}
declare function wssPlugin(instance: FastifyInstance, { endpoints, }: {
    delegate: Server.Delegate;
    endpoints?: Record<string, WebSocketServer>;
}): Promise<void>;
declare const _default: typeof wssPlugin;
export default _default;
