"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Compiler = void 0;
var _nodeEvents = _interopRequireDefault(require("node:events"));
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _nodeWorker_threads = require("node:worker_threads");
var _env = require("../../env.js");
var _index = require("../../helpers/index.js");
var _consts = require("../consts.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class Compiler extends _nodeEvents.default {
  workers = {};
  assetsCache = {};
  statsCache = {};
  resolvers = {};
  progressSenders = {};
  isCompilationInProgress = {};
  constructor(args, reporter, rootDir, reactNativePath) {
    super();
    this.args = args;
    this.reporter = reporter;
    this.rootDir = rootDir;
    this.reactNativePath = reactNativePath;
  }
  spawnWorker(platform) {
    this.isCompilationInProgress[platform] = true;
    const workerData = {
      platform,
      args: this.args,
      rootDir: this.rootDir,
      reactNativePath: this.reactNativePath
    };
    const worker = new _nodeWorker_threads.Worker(_nodePath.default.join(__dirname, './CompilerWorker.js'), {
      stdout: true,
      stderr: true,
      env: {
        ...process.env,
        [_env.WORKER_ENV_KEY]: '1'
      },
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
        this.assetsCache[platform] = {
          // keep old assets
          ...(this.assetsCache[platform] ?? {}),
          // convert asset data Uint8Array to Buffer
          ...Object.fromEntries(Object.entries(value.assets).map(([name, {
            data,
            info,
            size
          }]) => {
            return [name, {
              data: Buffer.from(data),
              info,
              size
            }];
          }))
        };
        this.emit(value.event, {
          platform,
          stats: value.stats
        });
        // Emit final progress with timing for this platform
        this.reporter.process({
          issuer: 'DevServer',
          timestamp: Date.now(),
          type: 'progress',
          message: [{
            progress: {
              platform,
              time: value.stats.time
            }
          }]
        });
        callPendingResolvers();
      } else if (value.event === 'error') {
        this.emit(value.event, value.error);
      } else if (value.event === 'progress') {
        this.progressSenders[platform].forEach(sendProgress => {
          const percentage = Math.floor(value.percentage * 100);
          sendProgress({
            completed: percentage,
            total: 100
          });
        });
        // skip reporting progress for the final last 1%
        // rely on the done event from the `compiler.done` hook
        if (value.percentage < 0.99) {
          this.reporter.process({
            issuer: 'DevServer',
            message: [{
              progress: {
                platform,
                value: value.percentage
              }
            }],
            timestamp: Date.now(),
            type: 'progress'
          });
        }
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
  addProgressSender(platform, callback) {
    if (!callback) return;
    this.progressSenders[platform] = this.progressSenders[platform] ?? [];
    this.progressSenders[platform].push(callback);
  }
  removeProgressSender(platform, callback) {
    if (!callback) return;
    this.progressSenders[platform] = this.progressSenders[platform].filter(item => item !== callback);
  }
  async getAsset(filename, platform, sendProgress) {
    // Return file from assetsCache if exists
    const fileFromCache = this.assetsCache[platform]?.[filename];
    if (fileFromCache) return fileFromCache;
    this.addProgressSender(platform, sendProgress);

    // Spawn new worker if not already running
    if (!this.workers[platform]) {
      this.workers[platform] = this.spawnWorker(platform);
    } else if (!this.isCompilationInProgress[platform]) {
      this.removeProgressSender(platform, sendProgress);
      return Promise.reject(new Error(`File ${filename} for ${platform} not found in compilation assets`));
    }
    return await new Promise((resolve, reject) => {
      // Add new resolver to be executed when compilation is finished
      this.resolvers[platform] = (this.resolvers[platform] ?? []).concat(error => {
        this.removeProgressSender(platform, sendProgress);
        if (error) {
          reject(error);
        } else {
          const fileFromCache = this.assetsCache[platform]?.[filename];
          if (fileFromCache) {
            resolve(fileFromCache);
          } else {
            reject(new Error(`File ${filename} for ${platform} not found in compilation assets`));
          }
        }
      });
    });
  }
  async getSource(filename, platform, sendProgress) {
    if (_consts.DEV_SERVER_ASSET_TYPES.test(filename)) {
      if (!platform) {
        throw new _index.CLIError(`Cannot detect platform for ${filename}`);
      }
      const asset = await this.getAsset(filename, platform, sendProgress);
      return asset.data;
    }
    try {
      const filePath = _nodePath.default.join(this.rootDir, filename);
      const source = await _nodeFs.default.promises.readFile(filePath, 'utf8');
      return source;
    } catch {
      throw new _index.CLIError(`File ${filename} not found`);
    }
  }
  async getSourceMap(filename, platform) {
    if (!platform) {
      throw new _index.CLIError(`Cannot determine platform for source map of ${filename}`);
    }
    try {
      const {
        info
      } = await this.getAsset(filename, platform);
      let sourceMapFilename = info.related?.sourceMap;
      if (!sourceMapFilename) {
        throw new _index.CLIError(`Cannot determine source map filename for ${filename} for ${platform}`);
      }
      if (Array.isArray(sourceMapFilename)) {
        sourceMapFilename = sourceMapFilename[0];
      }
      const sourceMap = await this.getAsset(sourceMapFilename, platform);
      return sourceMap.data;
    } catch {
      throw new _index.CLIError(`Source map for ${filename} for ${platform} is missing`);
    }
  }
}
exports.Compiler = Compiler;