import { WebSocketServer as WebSocketServerImpl } from 'ws';
/**
 * Abstract class for providing common logic (eg routing) for all WebSocket servers.
 *
 * @category Development server
 */

export class WebSocketServer {
  /** An instance of the underlying WebSocket server. */

  /** Fastify instance from which {@link server} will receive upgrade connections. */

  /**
   * Create a new instance of the WebSocketServer.
   * Any logging information, will be passed through standard `fastify.log` API.
   *
   * @param fastify Fastify instance to which the WebSocket will be attached to.
   * @param path Path on which this WebSocketServer will be accepting connections.
   * @param wssOptions WebSocket Server options.
   */
  constructor(fastify, path, wssOptions = {}) {
    this.fastify = fastify;
    this.server = new WebSocketServerImpl({
      noServer: true,
      ...wssOptions
    });
    this.server.on('connection', this.onConnection.bind(this));
    this.paths = Array.isArray(path) ? path : [path];
  }

  shouldUpgrade(pathname) {
    return this.paths.includes(pathname);
  }

  upgrade(request, socket, head) {
    this.server.handleUpgrade(request, socket, head, webSocket => {
      this.server.emit('connection', webSocket, request);
    });
  }
  /**
   * Process incoming WebSocket connection.
   *
   * @param socket Incoming WebSocket connection.
   * @param request Upgrade request for the connection.
   */


}
//# sourceMappingURL=WebSocketServer.js.map