"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DevServerProxy = void 0;

var _path = _interopRequireDefault(require("path"));

var _stream = require("stream");

var _execa = _interopRequireDefault(require("execa"));

var _getPort = _interopRequireDefault(require("get-port"));

var _split = _interopRequireDefault(require("split2"));

var _fastifyStatic = _interopRequireDefault(require("fastify-static"));

var _fastifyReplyFrom = _interopRequireDefault(require("fastify-reply-from"));

var _Reporter = require("../Reporter");

var _env = require("../env");

var _BaseDevServer = require("./BaseDevServer");

var _transformFastifyLogToWebpackLogEntry = require("./utils/transformFastifyLogToWebpackLogEntry");

var _WebSocketDashboardServer = require("./ws/WebSocketDashboardServer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
class DevServerProxy extends _BaseDevServer.BaseDevServer {
  static getLoggerOptions(getReporter) {
    let reporter;
    const logStream = new _stream.Writable({
      write: (chunk, _encoding, callback) => {
        if (!reporter) {
          reporter = getReporter();
        }

        const data = chunk.toString();
        const logEntry = (0, _transformFastifyLogToWebpackLogEntry.transformFastifyLogToLogEntry)(data);
        logEntry.issuer = 'DevServerProxy';
        reporter.process(logEntry);
        callback();
      }
    });
    return {
      stream: logStream,
      level: (0, _env.isVerbose)() ? 'debug' : 'info'
    };
  }
  /** Platform to worker mappings. */


  /**
   * Constructs new `DevServerProxy`.
   *
   * @param config Configuration options.
   * @param cliOptions CLI options (usually provided by {@link start} command based on arguments
   * from React Native CLI.)
   */
  constructor(config, cliOptions) {
    super(config, DevServerProxy.getLoggerOptions(() => this.reporter));
    this.cliOptions = cliOptions;

    _defineProperty(this, "workers", {});

    _defineProperty(this, "wsDashboardServer", this.wsRouter.registerServer(new _WebSocketDashboardServer.WebSocketDashboardServer(this.fastify)));

    _defineProperty(this, "reporter", new _Reporter.Reporter({
      wsEventsServer: this.wsEventsServer,
      wsDashboardServer: this.wsDashboardServer
    }));
  }
  /**
   * Spawn new compiler worker for given `platform`.
   * If the worker is already running, a warning is emitted and the method stops it's execution.
   * The port on which {@link DevServer} inside worker will be running is random, so no assumptions
   * should be taken regarding the port number.
   *
   * @param platform Application platform for which to spawn new worker.
   */


  async runWorker(platform) {
    if (this.workers[platform]) {
      this.fastify.log.warn({
        msg: 'Compiler worker is already running',
        platform
      });
      return;
    }

    const port = await (0, _getPort.default)();
    const cliOptionsWithPlatform = { ...this.cliOptions,
      arguments: {
        start: { ...this.cliOptions.arguments.start,
          platform,
          port
        }
      }
    };
    this.workers[platform] = new Promise(resolve => {
      var _process$stdout, _process$stderr;

      const env = {
        [_env.CLI_OPTIONS_ENV_KEY]: JSON.stringify(cliOptionsWithPlatform),
        [_env.WORKER_ENV_KEY]: '1',
        [_env.VERBOSE_ENV_KEY]: (0, _env.isVerbose)() ? '1' : undefined
      };
      this.fastify.log.info({
        msg: 'Starting compiler worker',
        platform,
        port
      });
      this.fastify.log.debug({
        msg: 'Compiler worker settings',
        env
      });

      const process = _execa.default.node(_path.default.join(__dirname, './compilerWorker.js'), [cliOptionsWithPlatform.config.webpackConfigPath], {
        stdio: 'pipe',
        env
      });

      let isResolved = false;

      const onStdData = event => {
        const data = event.toString().trim();

        if (data) {
          try {
            const logEntry = JSON.parse(data);
            this.reporter.process(logEntry);
          } catch {
            this.fastify.log.error({
              msg: 'Cannot parse compiler worker message',
              platform,
              message: data
            });
          }
        }
      };

      (_process$stdout = process.stdout) === null || _process$stdout === void 0 ? void 0 : _process$stdout.pipe((0, _split.default)()).on('data', onStdData);
      (_process$stderr = process.stderr) === null || _process$stderr === void 0 ? void 0 : _process$stderr.pipe((0, _split.default)()).on('data', onStdData);
      process.on('message', data => {
        const {
          event
        } = data;

        if (event === 'watchRun') {
          if (!isResolved) {
            isResolved = true;
            this.wsDashboardServer.send(JSON.stringify({
              kind: 'compilation',
              event: {
                name: 'watchRun',
                port,
                platform
              }
            }));
            resolve({
              port,
              process
            });
          }
        }
      });
    });
  }
  /**
   * Forward request to a {@link DevServer} running inside compiler worker for the `platform`.
   *
   * @param platform Application platform.
   * @param request Request instance to forward.
   * @param reply Reply instance to send received data through.
   */


  async forwardRequest(platform, request, reply) {
    if (!this.workers[platform]) {
      await this.runWorker(platform);
    }

    const {
      port
    } = await this.workers[platform];
    const host = request.headers[':authority'] || request.headers.host;
    const url = request.headers[':path'] || request.raw.url;

    if (!url || !host) {
      reply.code(500).send();
    } else {
      const compilerWorkerUrl = `http://localhost:${port}${url}`;
      this.fastify.log.debug({
        msg: 'Fetching from worker',
        url: compilerWorkerUrl,
        method: request.method,
        body: request.body
      });
      reply.from(compilerWorkerUrl);
    }
  }
  /**
   * Sets up routes.
   */


  async setup() {
    // TODO: figure out if we need it
    // await this.fastify.register(fastifyGracefulShutdown);
    // this.fastify.gracefulShutdown(async (code, cb) => {
    //   for (const platform in this.workers) {
    //     const worker = await this.workers[platform];
    //     worker.process.kill(code);
    //   }
    //   this.fastify.log.info({
    //     msg: 'Shutting down dev server proxy',
    //     port: this.config.port,
    //     code,
    //   });
    //   cb();
    // });
    await super.setup();

    const dashboardPublicDir = _path.default.join(__dirname, '../../first-party/dashboard');

    await this.fastify.register(_fastifyStatic.default, {
      root: dashboardPublicDir,
      prefix: '/dashboard',
      prefixAvoidTrailingSlash: true,
      decorateReply: false
    });
    this.fastify.register(_fastifyReplyFrom.default, {
      undici: {
        headersTimeout: 5 * 60 * 1000,
        bodyTimeout: 5 * 60 * 1000
      }
    });
    this.fastify.get('/dashboard/:page', (_, reply) => {
      reply.sendFile('index.html', dashboardPublicDir);
    });
    this.fastify.get('/api/dashboard/platforms', async () => {
      const platforms = await Promise.all(Object.keys(this.workers).map(async platform => {
        var _await$this$workers$p;

        return {
          id: platform,
          port: (_await$this$workers$p = await this.workers[platform]) === null || _await$this$workers$p === void 0 ? void 0 : _await$this$workers$p.port
        };
      }));
      return {
        platforms
      };
    });
    this.fastify.get('/api/dashboard/server-logs', (_, reply) => {
      reply.send({
        logs: this.reporter.getLogBuffer()
      });
    });
    this.fastify.post('/symbolicate', async (request, reply) => {
      var _request$query;

      const platform = (_request$query = request.query) === null || _request$query === void 0 ? void 0 : _request$query.platform;
      await this.forwardRequest(platform, request, reply);
      return reply;
    });
    this.fastify.route({
      method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
      url: '*',
      schema: {
        querystring: {
          type: 'object',
          properties: {
            platform: {
              type: 'string'
            }
          }
        }
      },
      handler: async (request, reply) => {
        var _request$query2;

        const platform = (_request$query2 = request.query) === null || _request$query2 === void 0 ? void 0 : _request$query2.platform;

        if (!platform) {
          this.fastify.log.warn({
            msg: 'Missing platform query param',
            query: request.query,
            method: request.method,
            url: request.url
          });
          reply.code(400).send();
        } else {
          try {
            await this.forwardRequest(platform, request, reply);
          } catch (error) {
            console.error(error);
            reply.code(500).send();
          }
        }

        return reply;
      }
    });
  }
  /**
   * Runs the proxy.
   */


  async run() {
    try {
      await this.setup();
      await super.run();
      this.fastify.log.info({
        msg: `Dashboard available at: http${this.config.https ? 's' : ''}://${this.config.host || 'localhost'}:${this.config.port}/dashboard`
      });
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

}

exports.DevServerProxy = DevServerProxy;
//# sourceMappingURL=DevServerProxy.js.map