"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OutputPlugin = void 0;
var _path = _interopRequireDefault(require("path"));
var _webpack = _interopRequireDefault(require("webpack"));
var _AssetsCopyProcessor = require("./utils/AssetsCopyProcessor");
var _AuxiliaryAssetsCopyProcessor = require("./utils/AuxiliaryAssetsCopyProcessor");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Matching options to check if given {@link DestinationConfig} should be used.
 */

/**
 * Destination config for local chunks.
 */

/**
 * Destination config for remote chunks.
 */

/**
 * Destination config for chunks.
 */

/**
 * Destination specification for chunks.
 */

/**
 * {@link OutputPlugin} configuration options.
 */

/**
 * Plugin for copying generated files (bundle, chunks, assets) from Webpack's built location to the
 * React Native application directory, so that the files can be packed together into the `ipa`/`apk`.
 *
 * @category Webpack Plugin
 */
class OutputPlugin {
  /**
   * Constructs new `OutputPlugin`.
   *
   * @param config Plugin configuration options.
   */
  constructor(config) {
    this.config = config;
    this.config.enabled = this.config.enabled ?? true;
    if (!this.config.platform) {
      throw new Error('Missing `platform` option in `OutputPlugin`');
    }
    if (!this.config.output) {
      throw new Error('Missing `output` option in `OutputPlugin`');
    }
    this.config.extraChunks = this.config.extraChunks ?? [{
      include: /.*/,
      type: 'remote',
      outputPath: _path.default.join(this.config.context, 'build/outputs', this.config.platform, 'remotes')
    }];
  }

  /**
   * Apply the plugin.
   *
   * @param compiler Webpack compiler instance.
   */
  apply(compiler) {
    if (!this.config.enabled) {
      return;
    }
    const outputPath = compiler.options.output?.path;
    if (!outputPath) {
      throw new Error('Cannot infer output path from compilation');
    }
    const logger = compiler.getInfrastructureLogger('RepackOutputPlugin');
    const extraAssets = (this.config.extraChunks ?? []).map(spec => spec.type === 'remote' ? {
      ...spec,
      outputPath: !_path.default.isAbsolute(spec.outputPath) ? _path.default.join(this.config.context, spec.outputPath) : spec.outputPath
    } : spec);
    const isLocalChunk = chunkId => {
      for (const spec of extraAssets) {
        if (spec.type === 'local') {
          if (_webpack.default.ModuleFilenameHelpers.matchObject({
            test: spec.test,
            include: spec.include,
            exclude: spec.exclude
          }, chunkId || '')) {
            return true;
          }
        }
      }
      return false;
    };
    const getRelatedSourceMap = chunk => {
      return chunk.auxiliaryFiles?.find(file => /\.map$/.test(file));
    };
    const getAllInitialChunks = (chunk, chunks) => {
      if (!chunk.parents?.length) return [chunk];
      return chunk.parents.flatMap(parent => {
        return getAllInitialChunks(chunks.get(parent), chunks);
      });
    };
    compiler.hooks.done.tapPromise('RepackOutputPlugin', async stats => {
      const compilationStats = stats.toJson({
        all: false,
        assets: true,
        chunks: true,
        chunkRelations: true,
        ids: true
      });
      const statsChunkMap = new Map(compilationStats.chunks.map(chunk => [chunk.id, chunk]));
      const entryChunkName = this.config.entryName ?? 'main';
      const localChunks = [];
      const remoteChunks = [];
      const sharedChunks = new Set();
      const auxiliaryAssets = new Set();
      const entryChunk = compilationStats.chunks.find(chunk => {
        return chunk.initial && chunk.names?.includes(entryChunkName);
      });
      localChunks.push(entryChunk);
      for (const chunk of compilationStats.chunks) {
        // Do not process shared chunks right now.
        if (sharedChunks.has(chunk)) {
          continue;
        }
        getAllInitialChunks(chunk, statsChunkMap).filter(sharedChunk => sharedChunk !== chunk).forEach(sharedChunk => {
          sharedChunks.add(sharedChunk);
        });
        if (isLocalChunk(chunk.name ?? chunk.id?.toString())) {
          localChunks.push(chunk);
        } else if (entryChunk !== chunk) {
          remoteChunks.push(chunk);
        }
      }

      // Process shared chunks to add them either as local or remote chunk.
      for (const sharedChunk of sharedChunks) {
        const isUsedByLocalChunk = localChunks.some(localChunk => getAllInitialChunks(localChunk, statsChunkMap).includes(sharedChunk));
        if (isUsedByLocalChunk || isLocalChunk(sharedChunk.name ?? sharedChunk.id?.toString())) {
          localChunks.push(sharedChunk);
        } else {
          remoteChunks.push(sharedChunk);
        }
      }
      const assets = compilationStats.assets;
      // Collect auxiliary assets (only remote-assets for now)
      assets.filter(asset => /^remote-assets/.test(asset.name)).forEach(asset => auxiliaryAssets.add(asset.name));
      let localAssetsCopyProcessor;
      let {
        bundleFilename,
        sourceMapFilename,
        assetsPath
      } = this.config.output;
      if (bundleFilename) {
        if (!_path.default.isAbsolute(bundleFilename)) {
          bundleFilename = _path.default.join(this.config.context, bundleFilename);
        }
        const bundlePath = _path.default.dirname(bundleFilename);
        if (!sourceMapFilename) {
          sourceMapFilename = `${bundleFilename}.map`;
        }
        if (!_path.default.isAbsolute(sourceMapFilename)) {
          sourceMapFilename = _path.default.join(this.config.context, sourceMapFilename);
        }
        if (!assetsPath) {
          assetsPath = bundlePath;
        }
        logger.debug('Detected output paths:', {
          bundleFilename,
          bundlePath,
          sourceMapFilename,
          assetsPath
        });
        localAssetsCopyProcessor = new _AssetsCopyProcessor.AssetsCopyProcessor({
          platform: this.config.platform,
          outputPath,
          bundleOutput: bundleFilename,
          bundleOutputDir: bundlePath,
          sourcemapOutput: sourceMapFilename,
          assetsDest: assetsPath,
          logger
        });
      }
      const remoteAssetsCopyProcessors = {};
      for (const chunk of localChunks) {
        // Process entry chunk
        localAssetsCopyProcessor?.enqueueChunk(chunk, {
          isEntry: entryChunk === chunk,
          sourceMapFile: getRelatedSourceMap(chunk)
        });
      }
      for (const chunk of remoteChunks) {
        const spec = extraAssets.find(spec => _webpack.default.ModuleFilenameHelpers.matchObject({
          test: spec.test,
          include: spec.include,
          exclude: spec.exclude
        }, chunk.name || chunk.id?.toString()));
        if (spec?.type === 'remote') {
          if (!remoteAssetsCopyProcessors[spec.outputPath]) {
            remoteAssetsCopyProcessors[spec.outputPath] = new _AssetsCopyProcessor.AssetsCopyProcessor({
              platform: this.config.platform,
              outputPath,
              bundleOutput: '',
              bundleOutputDir: spec.outputPath,
              sourcemapOutput: '',
              assetsDest: spec.outputPath,
              logger
            });
          }
          remoteAssetsCopyProcessors[spec.outputPath].enqueueChunk(chunk, {
            isEntry: false,
            sourceMapFile: getRelatedSourceMap(chunk)
          });
        }
      }
      let auxiliaryAssetsCopyProcessor;
      const {
        auxiliaryAssetsPath
      } = this.config.output;
      if (auxiliaryAssetsPath) {
        auxiliaryAssetsCopyProcessor = new _AuxiliaryAssetsCopyProcessor.AuxiliaryAssetsCopyProcessor({
          platform: this.config.platform,
          outputPath,
          assetsDest: auxiliaryAssetsPath,
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