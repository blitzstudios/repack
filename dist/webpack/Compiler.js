"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Compiler = void 0;

var _worker_threads = require("worker_threads");

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _events = _interopRequireDefault(require("events"));

var _mimeTypes = _interopRequireDefault(require("mime-types"));

var _env = require("../env");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Compiler extends _events.default {
  workers = {};
  assetsCache = {};
  statsCache = {};
  resolvers = {};
  progressSenders = {};
  isCompilationInProgress = {};

  constructor(cliOptions, reporter, isVerbose) {
    super();
    this.cliOptions = cliOptions;
    this.reporter = reporter;
    this.isVerbose = isVerbose;
  }

  spawnWorker(platform) {
    this.isCompilationInProgress[platform] = true;
    const workerData = { ...this.cliOptions,
      arguments: {
        start: { ...this.cliOptions.arguments.start,
          platform
        }
      }
    };
    process.env[_env.WORKER_ENV_KEY] = '1';
    process.env[_env.VERBOSE_ENV_KEY] = this.isVerbose ? '1' : undefined;
    const worker = new _worker_threads.Worker(_path.default.join(__dirname, './webpackWorker.js'), {
      stdout: true,
      stderr: true,
      env: _worker_threads.SHARE_ENV,
      workerData
    });

    const onStdChunk = (chunk, fallbackType) => {
      const data = chunk.toString().trim();

      if (data) {
        try {
          const log = JSON.parse(data);
          this.reporter.process(log);
        } catch {
          this.reporter.process({
            timestamp: Date.now(),
            type: fallbackType,
            issuer: 'WebpackCompilerWorker',
            message: [data]
          });
        }
      }
    };

    worker.stdout.on('data', chunk => {
      onStdChunk(chunk, 'info');
    });
    worker.stderr.on('data', chunk => {
      onStdChunk(chunk, 'info');
    });

    const callPendingResolvers = error => {
      this.resolvers[platform].forEach(resolver => resolver(error));
      this.resolvers[platform] = [];
    };

    worker.on('message', value => {
      if (value.event === 'done') {
        this.isCompilationInProgress[platform] = false;
        this.statsCache[platform] = value.stats;
        this.assetsCache[platform] = value.assets.reduce((acc, {
          filename,
          data,
          info
        }) => {
          const asset = {
            data: Buffer.from(data),
            info
          };
          return { ...acc,
            [(0, _utils.adaptFilenameToPlatform)(filename)]: asset
          };
        }, {});
        callPendingResolvers();
        this.emit(value.event, {
          platform,
          stats: value.stats
        });
      } else if (value.event === 'error') {
        this.emit(value.event, value.error);
      } else if (value.event === 'progress') {
        this.progressSenders[platform].forEach(sendProgress => sendProgress({
          total: value.total,
          completed: value.completed
        }));
        this.emit(value.event, {
          total: value.total,
          completed: value.completed,
          message: value.message
        });
      } else {
        this.isCompilationInProgress[platform] = true;
        this.emit(value.event, {
          platform
        });
      }
    });
    worker.on('error', error => {
      callPendingResolvers(error);
    });
    worker.on('exit', code => {
      callPendingResolvers(new Error(`Worker stopped with exit code ${code}`));
    });
    return worker;
  }

  async getAsset(filename, platform, sendProgress) {
    var _this$assetsCache$pla;

    // Return file from assetsCache if exists
    const fileFromCache = (_this$assetsCache$pla = this.assetsCache[platform]) === null || _this$assetsCache$pla === void 0 ? void 0 : _this$assetsCache$pla[filename];

    if (fileFromCache) {
      return fileFromCache;
    } // Spawn new worker if not already running


    if (!this.workers[platform]) {
      this.workers[platform] = this.spawnWorker(platform);
    } else if (!this.isCompilationInProgress[platform]) {
      return Promise.reject(new Error(`File ${filename} for ${platform} not found in compilation assets`));
    }

    if (sendProgress) {
      this.progressSenders[platform] = this.progressSenders[platform] ?? [];
      this.progressSenders[platform].push(sendProgress);
    }

    return new Promise((resolve, reject) => {
      // Add new resolver to be executed when compilation is finished
      this.resolvers[platform] = (this.resolvers[platform] ?? []).concat(error => {
        this.progressSenders[platform] = this.progressSenders[platform].filter(item => item !== sendProgress);

        if (error) {
          reject(error);
        } else {
          var _this$assetsCache$pla2;

          const fileFromCache = (_this$assetsCache$pla2 = this.assetsCache[platform]) === null || _this$assetsCache$pla2 === void 0 ? void 0 : _this$assetsCache$pla2[filename];

          if (fileFromCache) {
            resolve(fileFromCache);
          } else {
            reject(new Error(`File ${filename} for ${platform} not found in compilation assets`));
          }
        }
      });
    });
  }

  async getSource(filename, platform) {
    if (/\.bundle/.test(filename) && platform) {
      return (await this.getAsset(filename, platform)).data;
    }

    return _fs.default.promises.readFile(_path.default.join(this.cliOptions.config.root, filename), 'utf8');
  }

  async getSourceMap(filename, platform) {
    var _info$related;

    const {
      info
    } = await this.getAsset(filename, platform);
    const sourceMapFilename = (_info$related = info.related) === null || _info$related === void 0 ? void 0 : _info$related.sourceMap;

    if (sourceMapFilename) {
      return (await this.getAsset(sourceMapFilename, platform)).data;
    }

    return Promise.reject(new Error(`Source map for ${filename} for ${platform} is missing`));
  }

  getMimeType(filename) {
    if (filename.endsWith('.bundle')) {
      return 'text/javascript';
    }

    return _mimeTypes.default.lookup(filename) || 'text/plain';
  }

}

exports.Compiler = Compiler;
//# sourceMappingURL=Compiler.js.map