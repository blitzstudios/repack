"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggerPlugin = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

var _env = require("../../env");

var _logging = require("../../logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Logger plugin that handles all logging coming from the Webpack ecosystem, including compilation
 * progress as well as debug logs from other plugins and resolvers.
 *
 * @category Webpack Plugin
 */
class LoggerPlugin {
  static SUPPORTED_TYPES = ['debug', 'info', 'warn', 'error'];
  /** {@link Reporter} instance used to actually writing logs to terminal/file. */

  /**
   * Constructs new `LoggerPlugin`.
   *
   * @param config Plugin configuration options.
   */
  constructor(config) {
    this.config = config;

    if (this.config.output === undefined) {
      this.config.output = {
        console: true
      };
    }

    const reporters = [];

    if (this.config.output.console) {
      reporters.push(new _logging.ConsoleReporter({
        isWorker: (0, _env.isWorker)(),
        level: (0, _env.isVerbose)() ? 'verbose' : 'normal'
      }));
    }

    if (this.config.output.file) {
      reporters.push(new _logging.FileReporter({
        filename: this.config.output.file
      }));
    }

    this.reporter = (0, _logging.composeReporters)(reporters);
  }
  /**
   * Create log entry from Webpack log message from {@link WebpackLogger}.
   *
   * @param issuer Issuer of the message.
   * @param type Type of the message.
   * @param args The body of the message.
   * @param timestamp Timestamp when the message was recorder.
   * @returns Log entry object or undefined when if message is invalid.
   */


  createEntry(issuer, type, args, timestamp) {
    if (LoggerPlugin.SUPPORTED_TYPES.includes(type)) {
      return {
        timestamp: timestamp ?? Date.now(),
        issuer: issuer.includes('reactNativeAssetsLoader') ? 'reactNativeAssetsLoader' : issuer,
        type: type,
        message: args
      };
    }

    return undefined;
  }
  /**
   * Process log entry and pass it to {@link reporter} instance.
   *
   * @param entry Log entry to process
   */


  processEntry(entry) {
    var _this$config$output, _this$config$output2, _this$config$output3;

    if (!((_this$config$output = this.config.output) !== null && _this$config$output !== void 0 && _this$config$output.console) && !((_this$config$output2 = this.config.output) !== null && _this$config$output2 !== void 0 && _this$config$output2.file) && !((_this$config$output3 = this.config.output) !== null && _this$config$output3 !== void 0 && _this$config$output3.listener)) {
      return;
    }

    this.reporter.process(entry);

    if (this.config.output.listener) {
      this.config.output.listener(entry);
    }
  }
  /**
   * Apply the plugin.
   *
   * @param compiler Webpack compiler instance.
   */


  apply(compiler) {
    // Make sure webpack-cli doesn't print stats by default.
    if (compiler.options.stats === undefined) {
      compiler.options.stats = 'none';
    }

    if (this.config.devServerEnabled) {
      new _webpack.default.ProgressPlugin((percentage, message, text) => {
        const entry = this.createEntry('LoggerPlugin', 'info', [{
          progress: {
            value: percentage,
            label: message,
            message: text,
            platform: this.config.platform
          }
        }]);

        if (entry) {
          this.processEntry(entry);
        }
      }).apply(compiler);
    }

    compiler.hooks.infrastructureLog.tap('LoggerPlugin', (issuer, type, args) => {
      const entry = this.createEntry(issuer, type, args);

      if (entry) {
        this.processEntry(entry);
      }

      return true;
    });
    compiler.hooks.thisCompilation.tap('LoggerPlugin', compilation => {
      compilation.hooks.log.intercept({
        call: (issuer, {
          time,
          type,
          args
        }) => {
          const entry = this.createEntry(issuer, type, args, time);

          if (entry) {
            this.processEntry(entry);
          }
        }
      });
    });
    compiler.hooks.done.tap('LoggerPlugin', stats => {
      if (this.config.devServerEnabled) {
        const {
          time,
          errors,
          warnings
        } = stats.toJson({
          all: false,
          timings: true,
          errors: true,
          warnings: true
        });
        let entires = [];

        if (errors !== null && errors !== void 0 && errors.length) {
          entires = [this.createEntry('LoggerPlugin', 'error', ['Failed to build bundle due to errors']), ...errors.map(error => this.createEntry('LoggerPlugin', 'error', [`Error in "${error.moduleName}": ${error.message}`]))];
        } else {
          entires = [this.createEntry('LoggerPlugin', 'info', [warnings !== null && warnings !== void 0 && warnings.length ? 'Bundle built with warnings' : 'Bundle built', {
            time
          }]), ...((warnings === null || warnings === void 0 ? void 0 : warnings.map(warning => this.createEntry('LoggerPlugin', 'warn', [`Warning in "${warning.moduleName}": ${warning.message}`]))) ?? [])];
        }

        for (const entry of entires.filter(Boolean)) {
          this.processEntry(entry);
        }
      } else {
        const statsEntry = this.createEntry('LoggerPlugin', 'info', [stats.toString('all')]);

        if (statsEntry) {
          this.processEntry(statsEntry);
        }
      }

      this.reporter.flush();
      this.reporter.stop();
    });
    process.on('uncaughtException', error => {
      const errorEntry = this.createEntry('LoggerPlugin', 'error', [error]);

      if (errorEntry) {
        this.processEntry(errorEntry);
      }

      this.reporter.flush();
      this.reporter.stop();
    });
    process.on('exit', () => {
      this.reporter.flush();
      this.reporter.stop();
    });
  }

}

exports.LoggerPlugin = LoggerPlugin;
//# sourceMappingURL=LoggerPlugin.js.map