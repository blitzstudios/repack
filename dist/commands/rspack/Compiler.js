"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Compiler = void 0;
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _core = require("@rspack/core");
var _memfs = _interopRequireDefault(require("memfs"));
var _common = require("../common");
var _consts = require("../consts");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class Compiler {
  assetsCache = {};
  statsCache = {};
  resolvers = {};
  isCompilationInProgress = false;
  watchOptions = {};
  watching = null;
  // late-init

  constructor(cliOptions, reporter) {
    this.cliOptions = cliOptions;
    this.reporter = reporter;
    if (cliOptions.arguments.start.platform) {
      this.platforms = [cliOptions.arguments.start.platform];
    } else {
      this.platforms = cliOptions.config.platforms;
    }
  }
  callPendingResolvers(platform, error) {
    this.resolvers[platform]?.forEach(resolver => resolver(error));
    this.resolvers[platform] = [];
  }
  setDevServerContext(ctx) {
    this.devServerContext = ctx;
  }
  async init() {
    const webpackEnvOptions = (0, _common.getEnvOptions)(this.cliOptions);
    const configs = await Promise.all(this.platforms.map(async platform => {
      const env = {
        ...webpackEnvOptions,
        platform
      };
      const config = await (0, _common.loadConfig)(this.cliOptions.config.bundlerConfigPath, env);
      config.name = platform;
      return config;
    }));
    this.compiler = _core.rspack.rspack(configs);
    this.filesystem = _memfs.default.createFsFromVolume(new _memfs.default.Volume());
    // @ts-expect-error memfs is compatible enough
    this.compiler.outputFileSystem = this.filesystem;
    this.watchOptions = configs[0].watchOptions ?? {};
    this.compiler.hooks.watchRun.tap('repack:watch', () => {
      this.isCompilationInProgress = true;
      this.platforms.forEach(platform => {
        this.devServerContext.notifyBuildStart(platform);
      });
    });
    this.compiler.hooks.invalid.tap('repack:invalid', () => {
      this.isCompilationInProgress = true;
      this.platforms.forEach(platform => {
        this.devServerContext.notifyBuildStart(platform);
        this.devServerContext.broadcastToHmrClients({
          action: 'building'
        }, platform);
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
        stats.children?.map(childStats => {
          const platform = childStats.name;
          this.statsCache[platform] = childStats;
          const assets = this.statsCache[platform].assets;
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
            acc[(0, _common.adaptFilenameToPlatform)(name)] = asset;
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
              acc[(0, _common.adaptFilenameToPlatform)(sourceMapName)] = sourceMapAsset;
            }
            return acc;
          },
          // keep old assets, discard HMR-related ones
          Object.fromEntries(Object.entries(this.assetsCache[platform] ?? {}).filter(([_, asset]) => !asset.info.hotModuleReplacement)));
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
          action: 'built',
          body: this.getHmrBody(platform)
        }, platform);
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
    this.watching = this.compiler.watch(this.watchOptions, error => {
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
        throw new Error(`Cannot detect platform for ${filename}`);
      }
      const asset = await this.getAsset(filename, platform);
      return asset.data;
    }
    try {
      const filePath = _nodePath.default.join(this.cliOptions.config.root, filename);
      const source = await _nodeFs.default.promises.readFile(filePath, 'utf8');
      return source;
    } catch {
      throw new Error(`File ${filename} not found`);
    }
  }
  async getSourceMap(filename, platform) {
    if (!platform) {
      throw new Error(`Cannot determine platform for source map of ${filename}`);
    }
    try {
      const {
        info
      } = await this.getAsset(filename, platform);
      let sourceMapFilename = info.related?.sourceMap;
      if (!sourceMapFilename) {
        throw new Error(`Cannot determine source map filename for ${filename} for ${platform}`);
      }
      if (Array.isArray(sourceMapFilename)) {
        sourceMapFilename = sourceMapFilename[0];
      }
      const sourceMap = await this.getAsset(sourceMapFilename, platform);
      return sourceMap.data;
    } catch {
      throw new Error(`Source map for ${filename} for ${platform} is missing`);
    }
  }
  getHmrBody(platform) {
    const stats = this.statsCache[platform];
    if (!stats) {
      return null;
    }
    return {
      name: stats.name ?? '',
      time: stats.time ?? 0,
      hash: stats.hash ?? '',
      warnings: stats.warnings || [],
      errors: stats.errors || []
    };
  }
}
exports.Compiler = Compiler;
//# sourceMappingURL=Compiler.js.map