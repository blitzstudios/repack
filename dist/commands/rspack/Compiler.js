"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Compiler = void 0;
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _core = require("@rspack/core");
var _memfs = _interopRequireDefault(require("memfs"));
var _cliError = require("../common/cliError.js");
var _index = require("../common/index.js");
var _consts = require("../consts.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class Compiler {
  assetsCache = {};
  statsCache = {};
  resolvers = {};
  isCompilationInProgress = false;
  // late-init

  constructor(configs, reporter, rootDir) {
    this.reporter = reporter;
    this.rootDir = rootDir;
    this.compiler = _core.rspack.rspack(configs);
    this.platforms = configs.map(config => config.name);
    this.filesystem = _memfs.default.createFsFromVolume(new _memfs.default.Volume());
    // @ts-expect-error memfs is compatible enough
    this.compiler.outputFileSystem = this.filesystem;
    this.setupCompiler();
  }
  get devServerOptions() {
    return this.compiler.compilers[0].options.devServer ?? {};
  }
  get watchOptions() {
    return this.compiler.compilers[0].options.watchOptions ?? {};
  }
  callPendingResolvers(platform, error) {
    this.resolvers[platform]?.forEach(resolver => resolver(error));
    this.resolvers[platform] = [];
  }
  setDevServerContext(ctx) {
    this.devServerContext = ctx;
  }
  setupCompiler() {
    this.compiler.hooks.watchRun.tap('repack:watch', () => {
      this.isCompilationInProgress = true;
      this.platforms.forEach(platform => {
        if (platform === 'android') {
          void (0, _index.runAdbReverse)({
            port: this.devServerContext.options.port,
            logger: this.devServerContext.log
          });
        }
        this.devServerContext.notifyBuildStart(platform);
        this.devServerContext.broadcastToHmrClients({
          action: 'compiling',
          body: {
            name: platform
          }
        });
      });
    });
    this.compiler.hooks.invalid.tap('repack:invalid', () => {
      this.isCompilationInProgress = true;
      this.platforms.forEach(platform => {
        this.devServerContext.notifyBuildStart(platform);
        this.devServerContext.broadcastToHmrClients({
          action: 'compiling',
          body: {
            name: platform
          }
        });
      });
    });
    this.compiler.hooks.done.tap('repack:done', multiStats => {
      const stats = multiStats.toJson({
        all: false,
        assets: true,
        children: true,
        outputPath: true,
        timings: true,
        hash: true,
        errors: true,
        warnings: true
      });
      try {
        stats.children.map(childStats => {
          const platform = childStats.name;
          this.devServerContext.broadcastToHmrClients({
            action: 'hash',
            body: {
              name: platform,
              hash: childStats.hash
            }
          });
          this.statsCache[platform] = childStats;
          const assets = childStats.assets;
          this.assetsCache[platform] = assets.filter(asset => asset.type === 'asset').reduce((acc, {
            name,
            info,
            size
          }) => {
            const assetPath = _nodePath.default.join(childStats.outputPath, name);
            const data = this.filesystem.readFileSync(assetPath);
            const asset = {
              data,
              info,
              size
            };
            acc[(0, _index.adaptFilenameToPlatform)(name)] = asset;
            if (info.related?.sourceMap) {
              const sourceMapName = Array.isArray(info.related.sourceMap) ? info.related.sourceMap[0] : info.related.sourceMap;
              const sourceMapPath = _nodePath.default.join(childStats.outputPath, sourceMapName);
              const sourceMapData = this.filesystem.readFileSync(sourceMapPath);
              const sourceMapAsset = {
                data: sourceMapData,
                info: {
                  hotModuleReplacement: info.hotModuleReplacement,
                  size: sourceMapData.length
                },
                size: sourceMapData.length
              };
              acc[(0, _index.adaptFilenameToPlatform)(sourceMapName)] = sourceMapAsset;
            }
            return acc;
          },
          // keep old assets
          this.assetsCache[platform] ?? {});
        });
      } catch (error) {
        this.reporter.process({
          type: 'error',
          issuer: 'DevServer',
          timestamp: Date.now(),
          message: ['An error occured while processing assets from compilation:', String(error)]
        });
      }
      this.isCompilationInProgress = false;
      stats.children?.forEach(childStats => {
        const platform = childStats.name;
        this.callPendingResolvers(platform);
        this.devServerContext.notifyBuildEnd(platform);
        this.devServerContext.broadcastToHmrClients({
          action: 'ok',
          body: {
            name: platform
          }
        });
      });
    });
  }
  start() {
    this.reporter.process({
      type: 'info',
      issuer: 'DevServer',
      timestamp: Date.now(),
      message: ['Starting build for platforms:', this.platforms.join(', ')]
    });
    this.compiler.watch(this.watchOptions, error => {
      if (!error) return;
      this.platforms.forEach(platform => {
        this.callPendingResolvers(platform, error);
      });
    });
  }
  async getAsset(filename, platform) {
    // Return file from assetsCache if exists
    const fileFromCache = this.assetsCache[platform]?.[filename];
    if (fileFromCache) {
      return fileFromCache;
    }
    if (!this.isCompilationInProgress) {
      return Promise.reject(new Error(`File ${filename} for ${platform} not found in compilation assets (no compilation in progress)`));
    }
    return await new Promise((resolve, reject) => {
      // Add new resolver to be executed when compilation is finished
      this.resolvers[platform] = (this.resolvers[platform] ?? []).concat(error => {
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
  async getSource(filename, platform) {
    if (_consts.DEV_SERVER_ASSET_TYPES.test(filename)) {
      if (!platform) {
        throw new _cliError.CLIError(`Cannot detect platform for ${filename}`);
      }
      const asset = await this.getAsset(filename, platform);
      return asset.data;
    }
    try {
      const filePath = _nodePath.default.join(this.rootDir, filename);
      const source = await _nodeFs.default.promises.readFile(filePath, 'utf8');
      return source;
    } catch {
      throw new _cliError.CLIError(`File ${filename} not found`);
    }
  }
  async getSourceMap(filename, platform) {
    if (!platform) {
      throw new _cliError.CLIError(`Cannot determine platform for source map of ${filename}`);
    }
    try {
      const {
        info
      } = await this.getAsset(filename, platform);
      let sourceMapFilename = info.related?.sourceMap;
      if (!sourceMapFilename) {
        throw new _cliError.CLIError(`Cannot determine source map filename for ${filename} for ${platform}`);
      }
      if (Array.isArray(sourceMapFilename)) {
        sourceMapFilename = sourceMapFilename[0];
      }
      const sourceMap = await this.getAsset(sourceMapFilename, platform);
      return sourceMap.data;
    } catch {
      throw new _cliError.CLIError(`Source map for ${filename} for ${platform} is missing`);
    }
  }
}
exports.Compiler = Compiler;
//# sourceMappingURL=Compiler.js.map