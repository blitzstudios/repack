"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsoleReporter = void 0;

var _util = _interopRequireDefault(require("util"));

var _colorette = _interopRequireDefault(require("colorette"));

var _lodash = _interopRequireDefault(require("lodash.throttle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ConsoleReporter {
  constructor(config) {
    this.config = config;
    this.internalReporter = this.config.isWorker || this.config.asJson ? new JsonConsoleReporter(this.config) : new InteractiveConsoleReporter(this.config);
  }

  process(log) {
    this.internalReporter.process(log);
  }

  flush() {
    this.internalReporter.flush();
  }

  stop() {
    this.internalReporter.stop();
  }

}

exports.ConsoleReporter = ConsoleReporter;

class JsonConsoleReporter {
  constructor(config) {
    this.config = config;
  }

  process(log) {
    console.log(JSON.stringify(log));
  }

  flush() {// NOOP
  }

  stop() {// NOOP
  }

}

const IS_SYMBOL_SUPPORTED = process.platform !== 'win32' || process.env.CI || process.env.TERM === 'xterm-256color';
const SYMBOLS = {
  debug: _colorette.default.gray('?'),
  info: _colorette.default.blue('ℹ'),
  warn: _colorette.default.yellow('⚠'),
  error: _colorette.default.red('✖'),
  progress: _colorette.default.green('⇢')
};
const FALLBACK_SYMBOLS = {
  debug: _colorette.default.gray('?'),
  info: _colorette.default.blue('i'),
  warn: _colorette.default.yellow('!'),
  error: _colorette.default.red('x'),
  progress: _colorette.default.green('->')
};

class InteractiveConsoleReporter {
  requestBuffer = {};

  constructor(config) {
    this.config = config;
  }

  process(log) {
    // Do not log anything in silent mode
    if (this.config.level === 'silent') {
      return;
    } // Do not log debug messages in non-verbose mode


    if (log.type === 'debug' && this.config.level !== 'verbose') {
      return;
    }

    const [firstMessage] = log.message;

    if (typeof firstMessage === 'object' && 'progress' in firstMessage) {
      this.processProgress(log);
      return;
    }

    const normalizedLog = this.normalizeLog(log);

    if (normalizedLog) {
      process.stdout.write(`${IS_SYMBOL_SUPPORTED ? SYMBOLS[log.type] : FALLBACK_SYMBOLS[log.type]} ${this.prettifyLog(normalizedLog)}\n`);
    }
  }

  processProgress = (0, _lodash.default)(log => {
    const {
      progress: {
        value,
        label,
        message,
        platform
      }
    } = log.message[0];
    const percentage = Math.floor(value * 100);
    process.stdout.write(`${IS_SYMBOL_SUPPORTED ? SYMBOLS.progress : FALLBACK_SYMBOLS.progress} ${this.prettifyLog({
      timestamp: log.timestamp,
      issuer: log.issuer,
      type: 'info',
      message: [`Compiling ${platform}: ${percentage}% ${label}`].concat(...(message ? [`(${message})`] : []))
    })}\n`);
  }, 2000);

  normalizeLog(log) {
    const message = [];
    let issuer = log.issuer;

    for (const value of log.message) {
      if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
        message.push(value);
      } else if ('msg' in value && value.msg === 'incoming request') {
        // Incoming dev server request
        const {
          reqId,
          req
        } = value; // Save req object, so that we can extract data when request gets completed

        this.requestBuffer[reqId] = req;
      } else if ('msg' in value && value.msg === 'request completed') {
        // Dev server response
        const {
          reqId,
          res,
          msg,
          ...rest
        } = value;
        const bufferedReq = this.requestBuffer[reqId];

        if (bufferedReq) {
          message.push({
            request: {
              statusCode: res.statusCode,
              method: bufferedReq.method,
              url: bufferedReq.url
            }
          });
        }

        if (msg) {
          message.push(...(Array.isArray(msg) ? msg : [msg]));
        }

        if (Object.keys(rest).length) {
          message.push(rest);
        }
      } else if ('msg' in value) {
        const {
          msg,
          issuer: issuerOverride,
          ...rest
        } = value;
        issuer = issuerOverride || issuer;
        message.push(...(Array.isArray(msg) ? msg : [msg]), rest);
      } else {
        message.push(value);
      }
    } // Ignore empty logs


    if (!message.length) {
      return undefined;
    }

    return {
      timestamp: log.timestamp,
      type: log.type,
      issuer,
      message
    };
  }

  prettifyLog(log) {
    let body = '';

    for (const value of log.message) {
      if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
        // Colorize and concat primitive values
        body += colorizeText(log.type, value.toString());
        body += ' ';
      } else if ('request' in value) {
        // Colorize and concat dev server req/res object
        const {
          request
        } = value;
        let statusText = `${request.method} ${request.statusCode}`;

        let status = _colorette.default.green(statusText);

        if (request.statusCode >= 500) {
          status = _colorette.default.red(statusText);
        } else if (request.statusCode >= 400) {
          status = _colorette.default.yellow(statusText);
        }

        body += `${status} ${_colorette.default.gray(request.url)}`;
        body += ' ';
      } else if (Object.keys(value).length) {
        // Colorize and concat generic object
        body += _util.default.inspect(value, {
          colors: true,
          depth: 3
        }) + ' ';
      }
    }

    return _colorette.default.gray(`[${new Date(log.timestamp).toISOString().split('T')[1]}]`) + _colorette.default.bold(`[${log.issuer}]`) + ` ${body}`;
  }

  flush() {// NOOP
  }

  stop() {// NOOP
  }

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


function colorizeText(logType, text) {
  if (logType === 'warn') {
    return _colorette.default.yellow(text);
  } else if (logType === 'error') {
    return _colorette.default.red(text);
  }

  return text;
}
//# sourceMappingURL=ConsoleReporter.js.map