"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseDevServer = void 0;

var _path = _interopRequireDefault(require("path"));

var _fastifyStatic = _interopRequireDefault(require("fastify-static"));

var _open = _interopRequireDefault(require("open"));

var _openEditor = _interopRequireDefault(require("open-editor"));

var _getFastifyInstance = require("./utils/getFastifyInstance");

var _ws = require("./ws");

var _InspectorProxy = require("./hermes/InspectorProxy");

var _WebSocketRouter = require("./ws/WebSocketRouter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Base class for all Fastify-based servers.
 * It handles creation of a Fastify instance, creation of all WebSocket servers and running Fastify.
 *
 * @category Development server
 */
class BaseDevServer {
  /** Configuration options. */

  /** Fastify instance. */

  /** WebSocket router instance. */

  /** Debugger server instance. */

  /** Message server instance. */

  /** Events server instance. */

  /** Server instance for React Native clients. */

  /**
   * Constructs new `BaseDevServer` instance.
   *
   * @param config Configuration options.
   * @param loggerOptions Logger options.
   */
  constructor(config, loggerOptions) {
    _defineProperty(this, "config", void 0);

    _defineProperty(this, "fastify", void 0);

    _defineProperty(this, "wsRouter", void 0);

    _defineProperty(this, "wsDebuggerServer", void 0);

    _defineProperty(this, "wsMessageServer", void 0);

    _defineProperty(this, "wsEventsServer", void 0);

    _defineProperty(this, "wsClientServer", void 0);

    this.config = config;
    this.fastify = (0, _getFastifyInstance.getFastifyInstance)(this.config, loggerOptions);
    this.wsRouter = new _WebSocketRouter.WebSocketRouter(this.fastify);
    this.wsDebuggerServer = this.wsRouter.registerServer(new _ws.WebSocketDebuggerServer(this.fastify));
    this.wsMessageServer = this.wsRouter.registerServer(new _ws.WebSocketMessageServer(this.fastify));
    this.wsEventsServer = this.wsRouter.registerServer(new _ws.WebSocketEventsServer(this.fastify, {
      webSocketMessageServer: this.wsMessageServer
    }));
    this.wsClientServer = this.wsRouter.registerServer(new _ws.WebSocketDevClientServer(this.fastify)); // Use onRequest hook to add additional headers. We cannot use onSend
    // because WDM doesn't use typical Fastify lifecycle and onSend does not get called.

    this.fastify.addHook('onRequest', async (request, reply) => {
      reply.header('X-Content-Type-Options', 'nosniff');
      const [pathname] = request.url.split('?');

      if (pathname.endsWith('.map')) {
        reply.header('Access-Control-Allow-Origin', 'devtools://devtools');
      }
    });
    this.wsRouter.registerServer(new _InspectorProxy.InspectorProxy(this.fastify, this.config));
  }
  /**
   * Sets up common routes.
   *
   * All classes that implements {@link BaseDevServer} should call this method before
   * calling {@link run}.
   */


  async setup() {
    await this.fastify.register(_fastifyStatic.default, {
      root: _path.default.join(__dirname, '../../first-party/debugger-ui'),
      prefix: '/debugger-ui',
      prefixAvoidTrailingSlash: true
    });
    this.fastify.get('/', async () => {
      return 'React Native packager is running';
    });
    this.fastify.get('/status', async () => 'packager-status:running');
    this.fastify.route({
      method: ['GET', 'POST', 'PUT'],
      url: '/reload',
      handler: (_request, reply) => {
        this.wsMessageServer.broadcast('reload');
        reply.send('OK');
      }
    });
    this.fastify.route({
      method: ['GET', 'POST', 'PUT'],
      url: '/launch-js-devtools',
      handler: async (request, reply) => {
        const customDebugger = process.env.REACT_DEBUGGER;

        if (customDebugger) {// NOOP for now
        } else if (!this.wsDebuggerServer.isDebuggerConnected()) {
          const url = `${this.config.https ? 'https' : 'http'}://${this.config.host || 'localhost'}:${this.config.port}/debugger-ui`;

          try {
            this.fastify.log.info({
              msg: 'Opening debugger UI',
              url
            });
            await (0, _open.default)(url);
          } catch (error) {
            if (error) {
              this.fastify.log.error({
                msg: 'Cannot open debugger UI',
                url,
                error
              });
            }
          }
        }

        reply.send('OK');
      }
    });
    this.fastify.route({
      method: ['GET', 'POST', 'PUT'],
      url: '/open-stack-frame',
      handler: async (request, reply) => {
        try {
          const {
            file,
            lineNumber,
            column
          } = JSON.parse(request.body);
          const url = `${_path.default.join(this.config.context, file.replace('webpack://', ''))}:${lineNumber}:${column !== null && column !== void 0 ? column : 1}`;
          this.fastify.log.info({
            msg: 'Opening stack frame in editor',
            url
          });
          (0, _openEditor.default)([url]);
          reply.send('OK');
        } catch (error) {
          this.fastify.log.error({
            msg: 'Failed to open stack frame in editor',
            error: error.message
          });
          reply.code(400).send();
        }
      }
    });
    this.fastify.route({
      method: ['GET', 'POST', 'PUT'],
      url: '/open-url',
      handler: async (request, reply) => {
        try {
          const {
            url
          } = JSON.parse(request.body);
          this.fastify.log.info({
            msg: 'Opening URL',
            url
          });
          await (0, _open.default)(url);
          reply.send('OK');
        } catch (error) {
          this.fastify.log.error({
            msg: 'Failed to open URL',
            error
          });
          reply.code(400).send();
        }
      }
    }); // Silence this route

    this.fastify.get('/inspector/device', {
      logLevel: 'silent'
    }, (_request, reply) => {
      reply.code(404).send();
    });
  }
  /**
   * Runs Fastify and listens on port and host specified in constructor.
   */


  async run() {
    await this.fastify.listen({
      port: this.config.port,
      host: this.config.host
    });
  }

}

exports.BaseDevServer = BaseDevServer;
//# sourceMappingURL=BaseDevServer.js.map