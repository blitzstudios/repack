"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DevServer = void 0;

var _stream = require("stream");

var _path = _interopRequireDefault(require("path"));

var _fastifyExpress = _interopRequireDefault(require("fastify-express"));

var _webpackDevMiddleware = _interopRequireDefault(require("webpack-dev-middleware"));

var _getFilenameFromUrl = _interopRequireDefault(require("webpack-dev-middleware/dist/utils/getFilenameFromUrl"));

var _env = require("../env");

var _Symbolicator = require("./Symbolicator");

var _BaseDevServer = require("./BaseDevServer");

var _readFileFromWdm = require("./utils/readFileFromWdm");

var _transformFastifyLogToWebpackLogEntry = require("./utils/transformFastifyLogToWebpackLogEntry");

var _ws = require("./ws");

var _WebSocketDashboardServer = require("./ws/WebSocketDashboardServer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Class for setting up and running development server for React Native application.
 * It's usually created by the {@link DevServerPlugin}.
 *
 * Each `DevServer` instance is platform-specific, for example for `ios` and `android` platforms,
 * you need 2 `DevServer` running (on different ports). Alternatively you can
 * use {@link DevServerProxy} to spawn new processes with Webpack compilations for each platform.
 *
 * @category Development server
 */
class DevServer extends _BaseDevServer.BaseDevServer {
  static getLoggerOptions(compiler, platform) {
    const webpackLogger = compiler.getInfrastructureLogger(`DevServer@${platform}`);
    const logStream = new _stream.Writable({
      write: (chunk, _encoding, callback) => {
        const data = chunk.toString();
        const logEntry = (0, _transformFastifyLogToWebpackLogEntry.transformFastifyLogToLogEntry)(data);
        webpackLogger[logEntry.type](...logEntry.message);
        callback();
      }
    });
    return {
      stream: logStream,
      level: (0, _env.isVerbose)() ? 'debug' : 'info'
    };
  }
  /** [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) instance. */


  /**
   * Constructs new `DevServer` instance.
   *
   * @param config Configuration options.
   * @param compiler Webpack compiler instance.
   */
  constructor(config, compiler) {
    super(config, DevServer.getLoggerOptions(compiler, config.platform));
    this.compiler = compiler;

    _defineProperty(this, "wdm", void 0);

    _defineProperty(this, "hmrServer", void 0);

    _defineProperty(this, "wsDashboardServer", void 0);

    _defineProperty(this, "symbolicator", void 0);

    this.wdm = (0, _webpackDevMiddleware.default)(this.compiler, {
      mimeTypes: {
        bundle: 'text/javascript'
      }
    });
    this.hmrServer = this.wsRouter.registerServer(new _ws.WebSocketHMRServer(this.fastify, {
      compiler: this.compiler
    }));
    this.wsDashboardServer = this.wsRouter.registerServer(new _WebSocketDashboardServer.WebSocketDashboardServer(this.fastify, {
      compiler: this.compiler
    }));
    this.symbolicator = new _Symbolicator.Symbolicator(this.compiler.context, this.fastify.log, async fileUrl => {
      const filename = (0, _getFilenameFromUrl.default)(this.wdm.context, fileUrl);

      if (filename) {
        return (await (0, _readFileFromWdm.readFileFromWdm)(this.wdm, filename)).toString();
      } else {
        throw new Error(`Cannot infer filename from url: ${fileUrl}`);
      }
    }, async fileUrl => {
      const filename = (0, _getFilenameFromUrl.default)(this.wdm.context, fileUrl);

      if (filename) {
        var _sourceMappingUrl$spl;

        const fallbackSourceMapFilename = `${filename}.map`;
        const bundle = (await (0, _readFileFromWdm.readFileFromWdm)(this.wdm, filename)).toString();
        const [, sourceMappingUrl] = /sourceMappingURL=(.+)$/.exec(bundle) || [undefined, undefined];
        const [sourceMapBasename] = (_sourceMappingUrl$spl = sourceMappingUrl === null || sourceMappingUrl === void 0 ? void 0 : sourceMappingUrl.split('?')) !== null && _sourceMappingUrl$spl !== void 0 ? _sourceMappingUrl$spl : [undefined];
        let sourceMapFilename = fallbackSourceMapFilename;

        if (sourceMapBasename) {
          sourceMapFilename = _path.default.join(_path.default.dirname(filename), sourceMapBasename);
        }

        try {
          const sourceMap = await (0, _readFileFromWdm.readFileFromWdm)(this.wdm, sourceMapFilename);
          return sourceMap.toString();
        } catch {
          this.fastify.log.warn({
            msg: 'Failed to read source map from sourceMappingURL, trying fallback',
            sourceMappingUrl,
            sourceMapFilename
          });
          const sourceMap = await (0, _readFileFromWdm.readFileFromWdm)(this.wdm, fallbackSourceMapFilename);
          return sourceMap.toString();
        }
      } else {
        throw new Error(`Cannot infer filename from url: ${fileUrl}`);
      }
    });
  }
  /**
   * Sets up Fastify plugins and routes.
   */


  async setup() {
    await super.setup();
    await this.fastify.register(_fastifyExpress.default);
    this.fastify.use(this.wdm);
    this.fastify.post('/symbolicate', async (request, reply) => {
      try {
        var _request$query;

        let {
          stack
        } = JSON.parse(request.body);
        const platform = (_request$query = request.query) === null || _request$query === void 0 ? void 0 : _request$query.platform;

        for (let i = 0; i < stack.length; i++) {
          let bundle = _path.default.parse(stack[i].file).base;

          stack[i].file = `http://localhost:8081/${bundle}?platform=${platform}`;
        }

        if (!platform) {
          reply.code(400).send();
        } else {
          const results = await this.symbolicator.process(stack);
          reply.send(results);
        }
      } catch (error) {
        this.fastify.log.error({
          msg: 'Failed to symbolicate',
          error: error.message
        });
        reply.code(500).send();
      }
    });
    let lastStats;
    this.compiler.hooks.done.tap('DevServer', stats => {
      lastStats = stats;
    });
    this.fastify.get('/api/dashboard/stats', (_, reply) => {
      if (lastStats) reply.send(lastStats.toJson({
        preset: 'summary',
        assets: true,
        builtAt: true,
        chunks: true,
        chunkModules: false,
        errors: true,
        warnings: true,
        timings: true
      }));else {
        reply.code(404).send();
      }
    });
  }
  /**
   * Runs development server.
   */


  async run() {
    try {
      await this.setup();
      await super.run();
    } catch (error) {
      this.fastify.log.error(error);
      process.exit(1);
    }
  }

}

exports.DevServer = DevServer;
//# sourceMappingURL=DevServer.js.map