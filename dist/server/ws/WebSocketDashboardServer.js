"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebSocketDashboardServer = void 0;

var _WebSocketServer = require("./WebSocketServer");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Class for creating a WebSocket server for Dashboard client.
 * It's used by built-in Dashboard web-app to receive compilation
 * events, logs and other necessary messages.
 *
 * @category Development server
 */
class WebSocketDashboardServer extends _WebSocketServer.WebSocketServer {
  /**
   * Create new instance of WebSocketDashboardServer and attach it to the given Fastify instance.
   * Any logging information, will be passed through standard `fastify.log` API.
   *
   * @param fastify Fastify instance to attach the WebSocket server to.
   */
  constructor(fastify, config) {
    super(fastify, '/api/dashboard');
    this.config = config;

    _defineProperty(this, "clients", new Map());

    _defineProperty(this, "nextClientId", 0);

    if (this.config) {
      var _this$config$compiler, _this$config$compiler2;

      (_this$config$compiler = this.config.compiler) === null || _this$config$compiler === void 0 ? void 0 : _this$config$compiler.hooks.invalid.tap('WebSocketDashboardServer', () => {
        this.send(JSON.stringify({
          kind: 'compilation',
          event: {
            name: 'invalid'
          }
        }));
      });
      (_this$config$compiler2 = this.config.compiler) === null || _this$config$compiler2 === void 0 ? void 0 : _this$config$compiler2.hooks.done.tap('WebSocketDashboardServer', () => {
        this.send(JSON.stringify({
          kind: 'compilation',
          event: {
            name: 'done'
          }
        }));
      });
    }
  }
  /**
   * Send message to all connected Dashboard clients.
   *
   * @param message Stringified message to sent.
   */


  send(message) {
    for (const [, socket] of this.clients.entries()) {
      try {
        socket.send(message);
      } catch {// NOOP
      }
    }
  }
  /**
   * Process new WebSocket connection from client application.
   *
   * @param socket Incoming client's WebSocket connection.
   */


  onConnection(socket) {
    const clientId = `client#${this.nextClientId++}`;
    this.clients.set(clientId, socket);
    this.fastify.log.info({
      msg: 'Dashboard client connected',
      clientId
    });
    this.clients.set(clientId, socket);

    const onClose = () => {
      this.fastify.log.info({
        msg: 'Dashboard client disconnected',
        clientId
      });
      this.clients.delete(clientId);
    };

    socket.addEventListener('error', onClose);
    socket.addEventListener('close', onClose);
  }

}

exports.WebSocketDashboardServer = WebSocketDashboardServer;
//# sourceMappingURL=WebSocketDashboardServer.js.map