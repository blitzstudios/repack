"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggerPlugin = void 0;
var _env = require("../env.js");
var _index = require("../helpers/index.js");
var _index2 = require("../logging/index.js");
/**
 * {@link LoggerPlugin} configuration options.
 */

/**
 * Logger plugin that handles all logging coming from the Webpack ecosystem,
 * including debug logs from other plugins and resolvers.
 *
 * @category Webpack Plugin
 */
class LoggerPlugin {
  static SUPPORTED_TYPES = ['debug', 'info', 'warn', 'error', 'success'];

  /** {@link Reporter} instance used to actually writing logs to terminal/file. */

  /**
   * Constructs new `LoggerPlugin`.
   *
   * @param config Plugin configuration options.
   */
  constructor(config) {
    this.config = config;
    this.config.output = this.config.output ?? {
      console: true
    };
    const reporters = [];
    if (this.config.output.console) {
      reporters.push(new _index2.ConsoleReporter({
        isWorker: (0, _index.isTruthyEnv)(process.env[_env.WORKER_ENV_KEY]),
        isVerbose: (0, _index.isTruthyEnv)(process.env[_env.VERBOSE_ENV_KEY])
      }));
    }
    if (this.config.output.file) {
      reporters.push(new _index2.FileReporter({
        filename: this.config.output.file
      }));
    }
    this.reporter = (0, _index2.composeReporters)(reporters);
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
    if (!this.config.output?.console && !this.config.output?.file && !this.config.output?.listener) {
      return;
    }
    this.reporter.process(entry);
    if (this.config.output.listener) {
      this.config.output.listener(entry);
    }
  }
  apply(__compiler) {
    const compiler = __compiler;

    // Make sure webpack-cli doesn't print stats by default.
    if (compiler.options.stats === undefined) {
      compiler.options.stats = 'none';
    }
    compiler.hooks.infrastructureLog.tap('RepackLoggerPlugin', (issuer, type, args) => {
      const entry = this.createEntry(issuer, type, args);
      if (entry) {
        this.processEntry(entry);
      }
      return true;
    });
    compiler.hooks.thisCompilation.tap('RepackLoggerPlugin', compilation => {
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
    compiler.hooks.afterDone.tap('RepackLoggerPlugin', stats => {
      if (compiler.options.devServer) {
        const {
          errors,
          warnings
        } = stats.toJson({
          all: false,
          errors: true,
          warnings: true
        });
        const entires = errors?.length ? [this.createEntry('LoggerPlugin', 'error', ['Failed to build bundle due to errors']), ...errors.map(error => this.createEntry('LoggerPlugin', 'error', [`Error in "${error.moduleName}":\n${error.message}`]))] : [...(warnings?.map(warning => this.createEntry('LoggerPlugin', 'warn', [`Warning in "${warning.moduleName}":\n${warning.message}`])) ?? [])];
        for (const entry of entires.filter(Boolean)) {
          this.processEntry(entry);
        }
      } else {
        const statsEntry = this.createEntry('LoggerPlugin', 'info', [stats.toString({
          preset: 'normal',
          colors: true
        })]);
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