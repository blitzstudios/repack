"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebSocketServer = void 0;

var _ws = _interopRequireDefault(require("ws"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Abstract class for providing common logic (eg routing) for all WebSocket servers.
 *
 * @category Development server
 */
class WebSocketServer {
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
    _defineProperty(this, "server", void 0);

    _defineProperty(this, "fastify", void 0);

    _defineProperty(this, "paths", void 0);

    this.fastify = fastify;
    this.server = new _ws.default.Server({
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

exports.WebSocketServer = WebSocketServer;
//# sourceMappingURL=WebSocketServer.js.map