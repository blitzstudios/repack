import { WebSocketServer as WebSocketServerImpl } from 'ws';
/**
 * Abstract class for providing common logic (eg routing) for all WebSocket servers.
 *
 * @category Development server
 */
export class WebSocketServer {
    /**
     * Create a new instance of the WebSocketServer.
     * Any logging information, will be passed through standard `fastify.log` API.
     *
     * @param fastify Fastify instance to which the WebSocket will be attached to.
     * @param path Path on which this WebSocketServer will be accepting connections.
     * @param options WebSocketServer options.
     */
    constructor(fastify, options) {
        this.nextClientId = 0;
        this.timer = null;
        this.fastify = fastify;
        this.name = options.name;
        this.paths = Array.isArray(options.path) ? options.path : [options.path];
        this.server = new WebSocketServerImpl({ noServer: true, ...options.wss });
        this.server.on('connection', this.onConnection.bind(this));
        this.clients = new Map();
        // setup heartbeat timer
        this.timer = setInterval(() => {
            this.clients.forEach((socket) => {
                if (!socket.isAlive) {
                    socket.terminate();
                }
                else {
                    socket.isAlive = false;
                    socket.ping(() => { });
                }
            });
        }, 30000);
    }
    shouldUpgrade(pathname) {
        return this.paths.includes(pathname);
    }
    upgrade(request, socket, head) {
        this.server.handleUpgrade(request, socket, head, (webSocket) => {
            this.server.emit('connection', webSocket, request);
        });
    }
    onConnection(socket, _request) {
        const clientId = `client#${this.nextClientId++}`;
        this.clients.set(clientId, socket);
        this.fastify.log.debug({ msg: `${this.name} client connected`, clientId });
        const errorHandler = () => {
            this.fastify.log.debug({
                msg: `${this.name} client disconnected`,
                clientId,
            });
            socket.removeAllListeners(); // should we do this?
            this.clients.delete(clientId);
        };
        socket.addEventListener('error', errorHandler);
        socket.addEventListener('close', errorHandler);
        // heartbeat
        socket.isAlive = true;
        socket.on('pong', () => {
            socket.isAlive = true;
        });
        return clientId;
    }
}
