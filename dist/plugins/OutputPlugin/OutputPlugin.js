"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OutputPlugin = void 0;
var _nodeAssert = _interopRequireDefault(require("node:assert"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _env = require("../../env.js");
var _AssetsCopyProcessor = require("../utils/AssetsCopyProcessor.js");
var _AuxiliaryAssetsCopyProcessor = require("../utils/AuxiliaryAssetsCopyProcessor.js");
var _config = require("./config.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Plugin for copying generated files (bundle, chunks, assets) from Webpack's built location to the
 * React Native application directory, so that the files can be packed together into the `ipa`/`apk`.
 *
 * @category Webpack Plugin
 */
class OutputPlugin {
  localSpecs = [];
  remoteSpecs = [];
  constructor(config) {
    this.config = config;
    (0, _config.validateConfig)(config);
    this.config.enabled = this.config.enabled ?? true;
    this.config.extraChunks = this.config.extraChunks ?? [{
      include: /.*/,
      type: 'remote',
      outputPath: _nodePath.default.join(this.config.context, 'build/outputs', this.config.platform, 'remotes')
    }];
    this.bundleFilename = process.env[_env.BUNDLE_FILENAME_ENV_KEY];
    this.assetsPath = process.env[_env.ASSETS_DEST_ENV_KEY];
    this.sourceMapFilename = process.env[_env.SOURCEMAP_FILENAME_ENV_KEY];
    this.config.extraChunks?.forEach(spec => {
      if (spec.type === 'local') this.localSpecs.push(spec);
      if (spec.type === 'remote') this.remoteSpecs.push(spec);
    });
  }
  createChunkMatcher(matchObject) {
    return (chunk, specs) => {
      const chunkIds = [chunk.names ?? [], chunk.id].flat();
      return specs.filter(spec => {
        const {
          test,
          include,
          exclude
        } = spec;
        const config = {
          test,
          include,
          exclude
        };
        return chunkIds.some(id => matchObject(config, id.toString()));
      });
    };
  }
  getRelatedSourceMap(chunk) {
    return chunk.auxiliaryFiles?.find(file => /\.map$/.test(file));
  }
  ensureAbsolutePath(filePath) {
    if (_nodePath.default.isAbsolute(filePath)) return filePath;
    return _nodePath.default.join(this.config.context, filePath);
  }
  classifyChunks({
    chunks,
    chunkMatcher,
    entryOptions
  }) {
    const localChunks = new Set();
    const remoteChunks = new Set();
    const chunksById = new Map(chunks.map(chunk => [chunk.id, chunk]));

    // Add explicitly known initial chunks as local chunks
    chunks.filter(chunk => chunk.initial && chunk.entry).filter(chunk => chunk.id in entryOptions).forEach(chunk => localChunks.add(chunk));

    // Add siblings of known initial chunks as local chunks
    chunks.filter(chunk => localChunks.has(chunk)).flatMap(chunk => chunk.siblings).map(chunkId => chunksById.get(chunkId)).forEach(chunk => localChunks.add(chunk));

    // Add chunks matching local specs as local chunks
    chunks.filter(chunk => chunkMatcher(chunk, this.localSpecs).length).forEach(chunk => localChunks.add(chunk));

    // Add parents of local chunks as local chunks
    const addParentsOfLocalChunks = () => {
      chunks.filter(chunk => localChunks.has(chunk)).flatMap(chunk => chunk.parents).map(chunkId => chunksById.get(chunkId)).forEach(chunk => localChunks.add(chunk));
      return localChunks.size;
    };

    // Iterate until no new chunks are added
    while (localChunks.size - addParentsOfLocalChunks());

    // Add all other chunks as remote chunks
    chunks.filter(chunk => !localChunks.has(chunk)).forEach(chunk => remoteChunks.add(chunk));
    return {
      localChunks,
      remoteChunks
    };
  }

  /**
   * Apply the plugin.
   *
   * @param compiler Webpack compiler instance.
   */
  apply(compiler) {
    if (!this.config.enabled) return;
    (0, _nodeAssert.default)(compiler.options.output.path, "Can't infer output path from config");
    compiler.hooks.beforeCompile.tap('RepackOutputPlugin', () => {
      const deprecationMessages = (0, _config.getDeprecationMessages)(this.config);
      deprecationMessages.forEach(message => logger.warn(message));
    });
    const logger = compiler.getInfrastructureLogger('RepackOutputPlugin');
    const outputPath = compiler.options.output.path;

    // use ModuleFilenameHelpers.matchObject from compiler.webpack for compatibility
    const matchObject = compiler.webpack.ModuleFilenameHelpers.matchObject;
    const matchChunkToSpecs = this.createChunkMatcher(matchObject);
    const auxiliaryAssets = new Set();
    const entryChunkNames = new Set();
    compiler.hooks.entryOption.tap('RepackOutputPlugin', (_, entryNormalized) => {
      if (typeof entryNormalized === 'function') {
        throw new Error('[RepackOutputPlugin] Dynamic entry (function) is not supported.');
      }
      Object.keys(entryNormalized).forEach(entryName => {
        const entryChunkName = entryNormalized[entryName].runtime || entryName;
        entryChunkNames.add(entryChunkName);
      });
      if (entryChunkNames.size > 1) {
        throw new Error('[RepackOutputPlugin] Multiple entry chunks found. ' + 'Only one entry chunk is allowed as a native entrypoint.');
      }
    });
    compiler.hooks.done.tapPromise('RepackOutputPlugin', async stats => {
      const compilationStats = stats.toJson({
        all: false,
        assets: true,
        chunks: true,
        chunkRelations: true,
        ids: true
      });
      const assets = compilationStats.assets;
      const {
        localChunks,
        remoteChunks
      } = this.classifyChunks({
        chunks: compilationStats.chunks,
        chunkMatcher: matchChunkToSpecs,
        entryOptions: compiler.options.entry
      });

      // Collect auxiliary assets (only remote-assets for now)
      assets.filter(asset => /^remote-assets/.test(asset.name)).forEach(asset => auxiliaryAssets.add(asset.name));
      let localAssetsCopyProcessor;
      if (this.bundleFilename) {
        this.bundleFilename = this.ensureAbsolutePath(this.bundleFilename);
        const bundlePath = _nodePath.default.dirname(this.bundleFilename);
        this.sourceMapFilename = this.ensureAbsolutePath(this.sourceMapFilename || `${this.bundleFilename}.map`);
        this.assetsPath = this.assetsPath || bundlePath;
        logger.debug('Detected output paths:', JSON.stringify({
          bundleFilename: this.bundleFilename,
          bundlePath,
          sourceMapFilename: this.sourceMapFilename,
          assetsPath: this.assetsPath
        }));
        localAssetsCopyProcessor = new _AssetsCopyProcessor.AssetsCopyProcessor({
          platform: this.config.platform,
          outputPath,
          bundleOutput: this.bundleFilename,
          bundleOutputDir: bundlePath,
          sourcemapOutput: this.sourceMapFilename,
          assetsDest: this.assetsPath,
          logger
        });
      }
      const remoteAssetsCopyProcessors = {};
      for (const chunk of localChunks) {
        // Process entry chunk - only one entry chunk is allowed here
        localAssetsCopyProcessor?.enqueueChunk(chunk, {
          isEntry: entryChunkNames.has(chunk.id.toString()),
          sourceMapFile: this.getRelatedSourceMap(chunk)
        });
      }
      for (const chunk of remoteChunks) {
        const specs = matchChunkToSpecs(chunk, this.remoteSpecs);
        if (specs.length === 0) {
          throw new Error(`No spec found for chunk ${chunk.id}`);
        }
        if (specs.length > 1) {
          logger.warn(`Multiple specs found for chunk ${chunk.id}`);
        }
        const spec = specs[0];
        const specOutputPath = this.ensureAbsolutePath(spec.outputPath);
        if (!remoteAssetsCopyProcessors[specOutputPath]) {
          remoteAssetsCopyProcessors[specOutputPath] = new _AssetsCopyProcessor.AssetsCopyProcessor({
            platform: this.config.platform,
            outputPath,
            bundleOutput: '',
            bundleOutputDir: specOutputPath,
            sourcemapOutput: '',
            assetsDest: specOutputPath,
            logger
          });
        }
        remoteAssetsCopyProcessors[specOutputPath].enqueueChunk(chunk, {
          isEntry: false,
          sourceMapFile: this.getRelatedSourceMap(chunk)
        });
      }
      let auxiliaryAssetsCopyProcessor;
      const auxiliaryAssetsPath = this.config.output.auxiliaryAssetsPath;
      if (auxiliaryAssetsPath) {
        auxiliaryAssetsCopyProcessor = new _AuxiliaryAssetsCopyProcessor.AuxiliaryAssetsCopyProcessor({
          platform: this.config.platform,
          outputPath,
          assetsDest: this.ensureAbsolutePath(auxiliaryAssetsPath),
          logger
        });
        for (const asset of auxiliaryAssets) {
          auxiliaryAssetsCopyProcessor.enqueueAsset(asset);
        }
      }
      await Promise.all([...(localAssetsCopyProcessor?.execute() ?? []), ...Object.values(remoteAssetsCopyProcessors).reduce((acc, processor) => acc.concat(...processor.execute()), []), ...(auxiliaryAssetsCopyProcessor?.execute() ?? [])]);
    });
  }
}
exports.OutputPlugin = OutputPlugin;
//# sourceMappingURL=OutputPlugin.js.map