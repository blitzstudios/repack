"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OutputPlugin = void 0;

var _path = _interopRequireDefault(require("path"));

var _webpack = _interopRequireDefault(require("webpack"));

var _AssetsCopyProcessor = require("./utils/AssetsCopyProcessor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    const logger = compiler.getInfrastructureLogger('RepackOutputPlugin');
    const extraAssets = (this.config.extraChunks ?? []).map(spec => spec.type === 'remote' ? { ...spec,
      outputPath: !_path.default.isAbsolute(spec.outputPath) ? _path.default.join(this.config.context, spec.outputPath) : spec.outputPath
    } : spec);

    const isLocalChunk = chunkId => {
      for (const spec of extraAssets) {
        if (spec.type === 'local') {
          if (_webpack.default.ModuleFilenameHelpers.matchObject({
            test: spec.test,
            include: spec.include,
            exclude: spec.exclude
          }, chunkId)) {
            return true;
          }
        }
      }

      return false;
    };

    let entryGroup;
    let entryChunk;
    const entryChunkName = this.config.entryName ?? 'main';
    const localChunks = [];
    const remoteChunks = [];
    compiler.hooks.compilation.tap('RepackOutputPlugin', compilation => {
      compilation.hooks.processAssets.tap({
        name: 'RepackOutputPlugin',
        stage: _webpack.default.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
      }, () => {
        var _entryGroup;

        entryGroup = compilation.chunkGroups.find(group => group.isInitial());
        entryChunk = (_entryGroup = entryGroup) === null || _entryGroup === void 0 ? void 0 : _entryGroup.chunks.find(chunk => chunk.name === entryChunkName);
        const sharedChunks = new Set();

        for (const chunk of compilation.chunks) {
          var _chunk$id;

          // Do not process shared chunks right now.
          if (sharedChunks.has(chunk)) {
            continue;
          }

          [...chunk.getAllInitialChunks()].filter(sharedChunk => sharedChunk !== chunk).forEach(sharedChunk => {
            sharedChunks.add(sharedChunk);
          }); // Entry chunk

          if (entryChunk && entryChunk === chunk) {
            localChunks.push(chunk);
          } else if (isLocalChunk(chunk.name ?? ((_chunk$id = chunk.id) === null || _chunk$id === void 0 ? void 0 : _chunk$id.toString()))) {
            localChunks.push(chunk);
          } else {
            remoteChunks.push(chunk);
          }
        } // Process shared chunks to add them either as local or remote chunk.


        for (const sharedChunk of sharedChunks) {
          var _sharedChunk$id;

          const isUsedByLocalChunk = localChunks.some(localChunk => {
            return [...localChunk.getAllInitialChunks()].includes(sharedChunk);
          });

          if (isUsedByLocalChunk || isLocalChunk(sharedChunk.name ?? ((_sharedChunk$id = sharedChunk.id) === null || _sharedChunk$id === void 0 ? void 0 : _sharedChunk$id.toString()))) {
            localChunks.push(sharedChunk);
          } else {
            remoteChunks.push(sharedChunk);
          }
        }

        if (!entryChunk) {
          throw new Error('Cannot infer entry chunk - this should have not happened.');
        }
      });
    });
    compiler.hooks.afterEmit.tapPromise('RepackOutputPlugin', async compilation => {
      var _localAssetsCopyProce2;

      const outputPath = compilation.outputOptions.path;

      if (!outputPath) {
        throw new Error('Cannot infer output path from compilation');
      }

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
          compilation,
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
        var _localAssetsCopyProce;

        // Process entry chunk
        (_localAssetsCopyProce = localAssetsCopyProcessor) === null || _localAssetsCopyProce === void 0 ? void 0 : _localAssetsCopyProce.enqueueChunk(chunk, {
          isEntry: entryChunk === chunk
        });
      }

      for (const chunk of remoteChunks) {
        const spec = extraAssets.find(spec => {
          var _chunk$id2;

          return _webpack.default.ModuleFilenameHelpers.matchObject({
            test: spec.test,
            include: spec.include,
            exclude: spec.exclude
          }, chunk.name || ((_chunk$id2 = chunk.id) === null || _chunk$id2 === void 0 ? void 0 : _chunk$id2.toString()));
        });

        if ((spec === null || spec === void 0 ? void 0 : spec.type) === 'remote') {
          if (!remoteAssetsCopyProcessors[spec.outputPath]) {
            remoteAssetsCopyProcessors[spec.outputPath] = new _AssetsCopyProcessor.AssetsCopyProcessor({
              platform: this.config.platform,
              compilation,
              outputPath,
              bundleOutput: '',
              bundleOutputDir: spec.outputPath,
              sourcemapOutput: '',
              assetsDest: spec.outputPath,
              logger
            });
          }

          remoteAssetsCopyProcessors[spec.outputPath].enqueueChunk(chunk, {
            isEntry: false
          });
        }
      }

      await Promise.all([...(((_localAssetsCopyProce2 = localAssetsCopyProcessor) === null || _localAssetsCopyProce2 === void 0 ? void 0 : _localAssetsCopyProce2.execute()) ?? []), ...Object.values(remoteAssetsCopyProcessors).reduce((acc, processor) => acc.concat(...processor.execute()), [])]);
    });
  }

}

exports.OutputPlugin = OutputPlugin;
//# sourceMappingURL=OutputPlugin.js.map