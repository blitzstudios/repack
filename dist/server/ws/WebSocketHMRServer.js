"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebSocketHMRServer = void 0;

var _WebSocketServer = require("./WebSocketServer");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Class for creating a WebSocket server for Hot Module Replacement.
 *
 * @category Development server
 */
class WebSocketHMRServer extends _WebSocketServer.WebSocketServer {
  /**
   * Create new instance of WebSocketHMRServer and attach it to the given Fastify instance.
   * Any logging information, will be passed through standard `fastify.log` API.
   *
   * @param fastify Fastify instance to attach the WebSocket server to.
   */
  constructor(fastify, config) {
    super(fastify, '/__hmr');
    this.config = config;

    _defineProperty(this, "latestStats", void 0);

    _defineProperty(this, "clients", new Map());

    _defineProperty(this, "nextClientId", 0);

    const {
      compiler
    } = this.config;
    compiler.hooks.invalid.tap('WebSocketHMRServer', () => {
      this.sendAction('building');
    });
    compiler.hooks.done.tap('WebSocketHMRServer', stats => {
      this.latestStats = stats;
      this.sendAction('built');
    });
  }
  /**
   * Send action to all connected HMR clients.
   *
   * @param action Action to send to the clients.
   */


  sendAction(action) {
    if (!this.clients.size) {
      return;
    }

    let body = null;

    if (action !== 'building') {
      var _this$latestStats, _stats$name, _stats$time, _stats$hash;

      const stats = (_this$latestStats = this.latestStats) === null || _this$latestStats === void 0 ? void 0 : _this$latestStats.toJson({
        all: false,
        cached: true,
        children: true,
        modules: true,
        timings: true,
        hash: true,
        errors: true,
        warnings: false
      });

      if (!stats) {
        this.fastify.log.warn({
          msg: 'Cannot send action to client since stats are missing',
          action,
          hasStats: Boolean(this.latestStats)
        });
        return;
      }

      const modules = {};

      for (const module of (_stats$modules = stats.modules) !== null && _stats$modules !== void 0 ? _stats$modules : []) {
        var _stats$modules;

        const {
          identifier,
          name
        } = module;

        if (identifier !== undefined && name) {
          modules[identifier] = name;
        }
      }

      body = {
        name: (_stats$name = stats.name) !== null && _stats$name !== void 0 ? _stats$name : '',
        time: (_stats$time = stats.time) !== null && _stats$time !== void 0 ? _stats$time : 0,
        hash: (_stats$hash = stats.hash) !== null && _stats$hash !== void 0 ? _stats$hash : '',
        warnings: stats.warnings || [],
        errors: stats.errors || [],
        modules
      };
    }

    const event = JSON.stringify({
      action,
      body
    });

    for (const [clientId, socket] of this.clients) {
      try {
        socket.send(event);
      } catch (error) {
        this.fastify.log.error({
          msg: 'Cannot send action to client',
          action,
          error,
          clientId
        });
      }
    }
  }
  /**
   * Process new WebSocket connection from HMR client.
   *
   * @param socket Incoming HMR client's WebSocket connection.
   */


  onConnection(socket) {
    const clientId = `client#${this.nextClientId++}`;
    this.clients.set(clientId, socket);
    this.fastify.log.info({
      msg: 'HMR client connected',
      clientId
    });

    const onClose = () => {
      this.fastify.log.info({
        msg: 'HMR client disconnected',
        clientId
      });
      this.clients.delete(clientId);
    };

    socket.addEventListener('error', onClose);
    socket.addEventListener('close', onClose);
    this.sendAction('sync');
  }

}

exports.WebSocketHMRServer = WebSocketHMRServer;
//# sourceMappingURL=WebSocketHMRServer.js.map