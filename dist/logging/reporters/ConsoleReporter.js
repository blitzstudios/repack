"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsoleReporter = void 0;
var _nodeUtil = _interopRequireDefault(require("node:util"));
var colorette = _interopRequireWildcard(require("colorette"));
var _throttleit = _interopRequireDefault(require("throttleit"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
  flush() {
    // NOOP
  }
  stop() {
    // NOOP
  }
}
const IS_SYMBOL_SUPPORTED = process.platform !== 'win32' || process.env.CI || process.env.TERM === 'xterm-256color';
const SYMBOLS = {
  debug: colorette.gray('?'),
  info: colorette.blue('ℹ'),
  warn: colorette.yellow('⚠'),
  error: colorette.red('✖'),
  success: colorette.green('✔'),
  progress: colorette.green('⇢')
};
const FALLBACK_SYMBOLS = {
  debug: colorette.gray('?'),
  info: colorette.blue('i'),
  warn: colorette.yellow('!'),
  error: colorette.red('x'),
  success: colorette.green('✓'),
  progress: colorette.green('->')
};
class InteractiveConsoleReporter {
  requestBuffer = {};
  constructor(config) {
    this.config = config;
  }
  process(log) {
    // Do not log debug messages in non-verbose mode
    if (log.type === 'debug' && !this.config.isVerbose) {
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
        } = value;
        // Save req object, so that we can extract data when request gets completed
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
    }

    // Ignore empty logs
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
  processProgress = (0, _throttleit.default)(log => {
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
  }, 1000);
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
        const statusText = `${request.method} ${request.statusCode}`;
        let status = colorette.green(statusText);
        if (request.statusCode >= 500) {
          status = colorette.red(statusText);
        } else if (request.statusCode >= 400) {
          status = colorette.yellow(statusText);
        }
        body += `${status} ${colorette.gray(request.url)}`;
        body += ' ';
      } else if (Object.keys(value).length) {
        // Colorize and concat generic object
        body += _nodeUtil.default.inspect(value, {
          colors: true,
          depth: 3
        }) + ' ';
      }
    }
    return colorette.gray(`[${new Date(log.timestamp).toISOString().split('T')[1]}]`) + colorette.bold(`[${log.issuer}]`) + ` ${body}`;
  }
  flush() {
    // NOOP
  }
  stop() {
    // NOOP
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
    return colorette.yellow(text);
  }
  if (logType === 'error') {
    return colorette.red(text);
  }
  return text;
}
//# sourceMappingURL=ConsoleReporter.js.map