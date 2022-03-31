"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Reporter = void 0;

var _util = _interopRequireDefault(require("util"));

var _fs = _interopRequireDefault(require("fs"));

var _ora = _interopRequireDefault(require("ora"));

var _colorette = _interopRequireDefault(require("colorette"));

var _env = require("./env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const IS_SYMBOL_SUPPORTED = process.platform !== 'win32' || process.env.CI || process.env.TERM === 'xterm-256color';
const SYMBOLS = {
  debug: _colorette.default.gray('?'),
  info: _colorette.default.blue('ℹ'),
  warn: _colorette.default.yellow('⚠'),
  error: _colorette.default.red('✖')
};
const FALLBACK_SYMBOLS = {
  debug: _colorette.default.gray('?'),
  info: _colorette.default.blue('i'),
  warn: _colorette.default.yellow('!'),
  error: _colorette.default.red('x')
};

/**
 * Class that handles all reporting, logging and compilation progress handling.
 */
class Reporter {
  /**
   * Get message symbol for given log type.
   *
   * @param logType Log type.
   * @returns String with the symbol.
   *
   * @internal
   */
  static getSymbolForType(logType) {
    if (IS_SYMBOL_SUPPORTED) {
      return SYMBOLS[logType];
    }

    return FALLBACK_SYMBOLS[logType];
  }
  /**
   * Apply ANSI colors to given text.
   *
   * @param logType Log type for the text, based on which different colors will be applied.
   * @param text Text to apply the color onto.
   * @returns Text wrapped in ANSI color sequences.
   *
   * @internal
   */


  static colorizeText(logType, text) {
    if (logType === 'warn') {
      return _colorette.default.yellow(text);
    } else if (logType === 'error') {
      return _colorette.default.red(text);
    }

    return text;
  }
  /** Whether reporter is running as a worker. */


  /**
   * Create new instance of Reporter.
   * If Reporter is running as a non-worker, it will start outputting to terminal.
   *
   * @param config Reporter configuration. Defaults to empty object.
   */
  constructor(config = {}) {
    var _this$config$verbose;

    this.config = config;

    _defineProperty(this, "isWorker", void 0);

    _defineProperty(this, "isVerbose", void 0);

    _defineProperty(this, "ora", void 0);

    _defineProperty(this, "requestBuffer", {});

    _defineProperty(this, "fileLogBuffer", []);

    _defineProperty(this, "outputFilename", void 0);

    _defineProperty(this, "progress", {});

    _defineProperty(this, "logBuffer", []);

    this.isWorker = (0, _env.isWorker)();
    this.isVerbose = (_this$config$verbose = this.config.verbose) !== null && _this$config$verbose !== void 0 ? _this$config$verbose : (0, _env.isVerbose)();

    if (!this.isWorker) {
      this.ora = (0, _ora.default)('Running...').start();
    }
  }
  /**
   * Get buffered server logs.
   *
   * @returns Array of server log entries.
   */


  getLogBuffer() {
    return this.logBuffer;
  }
  /**
   * Stop reporting and perform cleanup.
   */


  stop() {
    if (!this.isWorker && this.ora) {
      this.ora.stop();
    }
  }
  /**
   * Enable reporting to file alongside reporting to terminal.
   *
   * @param filename Absolute path to file to which write logs.
   */


  enableFileLogging(filename) {
    this.outputFilename = filename;
  }
  /**
   * Flush all buffered logs to a file provided that file
   * reporting was enabled with {@link enableFileLogging}.
   */


  flushFileLogs() {
    if (this.outputFilename) {
      _fs.default.writeFileSync(this.outputFilename, this.fileLogBuffer.join('\n'));

      this.fileLogBuffer = [];
    }
  }
  /**
   * Process new log entry and report it to terminal and file if file reporting was enabled with
   * {@link enableFileLogging}.
   *
   * @param logEntry Log entry to process & report.
   */


  process(logEntry) {
    var _logEntry$message, _logEntry$message$;

    if (this.outputFilename) {
      this.fileLogBuffer.push(JSON.stringify(logEntry));
    }

    let shouldReport = logEntry.type !== 'debug' || this.isVerbose; // Allow to skip broadcasting messages - e.g. if broadcasting fails we don't want to try
    // to broadcast the failure as there's a high change it will fail again and cause infinite loop.

    const shouldBroadcast = !((_logEntry$message = logEntry.message) !== null && _logEntry$message !== void 0 && (_logEntry$message$ = _logEntry$message[0]) !== null && _logEntry$message$ !== void 0 && _logEntry$message$._skipBroadcast); // When reporter is running inside worker, simply stringify the entry
    // and use console to log it to stdout. It will be later caught by DevSeverProxy.

    if (this.isWorker) {
      console.log(JSON.stringify(logEntry));
    } else {
      if (this.isProgress(logEntry)) {
        var _this$config$wsDashbo;

        const {
          progress: {
            value,
            label,
            platform,
            message
          }
        } = logEntry.message[0];
        this.progress[platform] = {
          value,
          label
        };
        this.updateProgress();
        (_this$config$wsDashbo = this.config.wsDashboardServer) === null || _this$config$wsDashbo === void 0 ? void 0 : _this$config$wsDashbo.send(JSON.stringify({
          kind: 'progress',
          value,
          label,
          platform,
          message
        }));
      } else {
        const transformedLogEntry = this.transformLogEntry(logEntry); // Ignore empty logs

        if (transformedLogEntry) {
          if (shouldBroadcast) {
            var _this$config$wsEvents;

            (_this$config$wsEvents = this.config.wsEventsServer) === null || _this$config$wsEvents === void 0 ? void 0 : _this$config$wsEvents.broadcastEvent({
              type: `repack_${transformedLogEntry.type}`,
              data: [transformedLogEntry.issuer, ...transformedLogEntry.message]
            });
          } // Disable route logging if not verbose. It would be better to do it on per-router/Fastify
          // level but unless webpack-dev-middleware is migrated to Fastify that's not a feasible solution.
          // TODO: silence route logs on per-router/Fastify


          if (transformedLogEntry.message[0].request && !this.isVerbose) {
            shouldReport = false;
          }

          if (shouldReport) {
            var _this$config$wsDashbo2;

            this.logBuffer = this.logBuffer.concat(logEntry).slice(-500);
            (_this$config$wsDashbo2 = this.config.wsDashboardServer) === null || _this$config$wsDashbo2 === void 0 ? void 0 : _this$config$wsDashbo2.send(JSON.stringify({
              kind: 'server-log',
              log: logEntry
            }));
          }

          const text = this.getOutputLogMessage(transformedLogEntry);

          if (shouldReport && this.ora) {
            this.ora.stopAndPersist({
              symbol: Reporter.getSymbolForType(logEntry.type),
              text
            });
            this.ora.start('Running...');
          }
        }
      }
    }
  }

  updateProgress() {
    var _this$ora;

    let text = 'Running: ';

    for (const platform in this.progress) {
      const {
        value,
        label
      } = this.progress[platform];
      text += `(${platform}) ${label} ${Math.round(value * 100)}% `;
    }

    (_this$ora = this.ora) === null || _this$ora === void 0 ? void 0 : _this$ora.start(text);
  }

  isProgress(logEntry) {
    var _logEntry$message2, _logEntry$message2$;

    return Boolean((_logEntry$message2 = logEntry.message) === null || _logEntry$message2 === void 0 ? void 0 : (_logEntry$message2$ = _logEntry$message2[0]) === null || _logEntry$message2$ === void 0 ? void 0 : _logEntry$message2$.progress);
  }

  transformLogEntry(logEntry) {
    const message = [];
    let issuer = logEntry.issuer;

    for (const value of logEntry.message) {
      if (typeof value === 'string') {
        message.push(value);
      } else {
        const {
          msg,
          req,
          reqId,
          res,
          responseTime,
          // eslint-disable-line @typescript-eslint/no-unused-vars
          issuer: issuerOverride,
          ...rest
        } = value;

        if (issuerOverride) {
          issuer = issuerOverride;
        } // Route logs from Fastify (DevServerProxy, DevServer)


        if ((req || res) && reqId !== undefined) {
          if (req) {
            this.requestBuffer[reqId] = req; // Logs in the future should have a `res` with the same `reqId`, so we will be
            // able to match it. For now process next value.

            continue;
          }

          if (res) {
            const bufferedReq = this.requestBuffer[reqId];

            if (bufferedReq) {
              message.push({
                request: {
                  statusCode: res.statusCode,
                  method: bufferedReq.method,
                  url: bufferedReq.url
                }
              }); // Ignore msg/other data and process next value

              continue;
            } else {
              // Ignore and process next value
              continue;
            }
          }
        } // Usually non-route logs from Fastify (DevServerProxy, DevServer will have a `msg` field)


        if (msg) {
          message.push(...(Array.isArray(msg) ? msg : [msg]));
        }

        if (Object.keys(rest).length) {
          message.push(rest);
        }
      }
    } // Ignore empty logs


    if (!message.length) {
      return undefined;
    }

    return {
      timestamp: logEntry.timestamp,
      type: logEntry.type,
      issuer,
      message
    };
  }

  getOutputLogMessage(logEntry) {
    let body = '';

    for (const value of logEntry.message) {
      if (typeof value === 'string') {
        body += Reporter.colorizeText(logEntry.type, value);
        body += ' ';
      } else {
        const {
          request,
          ...rest
        } = value;

        if (request) {
          let rawStatus = `${request.method} ${request.statusCode}`;

          let status = _colorette.default.green(rawStatus);

          if (request.statusCode >= 500) {
            status = _colorette.default.red(rawStatus);
          } else if (request.statusCode >= 400) {
            status = _colorette.default.yellow(rawStatus);
          }

          body += `${status} ${_colorette.default.gray(request.url)}`;
          body += ' ';
        }

        if (Object.keys(rest).length) {
          body += _util.default.inspect(rest, {
            colors: true,
            depth: 3
          }) + ' ';
        }
      }
    }

    return _colorette.default.gray(`[${new Date(logEntry.timestamp).toISOString().split('T')[1]}]`) + _colorette.default.bold(`[${logEntry.issuer}]`) + ` ${body}`;
  }

}

exports.Reporter = Reporter;
//# sourceMappingURL=Reporter.js.map