"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OutputPlugin = void 0;

var _path = _interopRequireDefault(require("path"));

var _webpack = _interopRequireDefault(require("webpack"));

var _env = require("../../env");

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

    if (!this.config.platform) {
      throw new Error('Missing `platform` option in `OutputPlugin`');
    }
  }
  /**
   * Apply the plugin.
   *
   * @param compiler Webpack compiler instance.
   */


  apply(compiler) {
    var _process$env$CLI_OPTI;

    const cliOptions = JSON.parse((_process$env$CLI_OPTI = process.env[_env.CLI_OPTIONS_ENV_KEY]) !== null && _process$env$CLI_OPTI !== void 0 ? _process$env$CLI_OPTI : 'null'); // Noop when running from Webpack CLI or when running with dev server

    if (!cliOptions || 'start' in cliOptions.arguments || this.config.devServerEnabled) {
      return;
    }

    const logger = compiler.getInfrastructureLogger('ReactNativeOutputPlugin');
    const args = cliOptions.arguments.bundle;
    let {
      bundleOutput,
      assetsDest = '',
      sourcemapOutput = ''
    } = args;

    if (!_path.default.isAbsolute(bundleOutput)) {
      bundleOutput = _path.default.join(cliOptions.config.root, bundleOutput);
    }

    const bundleOutputDir = _path.default.dirname(bundleOutput);

    if (!sourcemapOutput) {
      sourcemapOutput = `${bundleOutput}.map`;
    }

    if (!_path.default.isAbsolute(sourcemapOutput)) {
      sourcemapOutput = _path.default.join(cliOptions.config.root, sourcemapOutput);
    }

    if (!assetsDest) {
      assetsDest = bundleOutputDir;
    }

    let remoteChunksOutput = this.config.remoteChunksOutput;

    if (remoteChunksOutput && !_path.default.isAbsolute(remoteChunksOutput)) {
      remoteChunksOutput = _path.default.join(cliOptions.config.root, remoteChunksOutput);
    }

    logger.debug('Detected output paths:', {
      bundleOutput,
      sourcemapOutput,
      assetsDest,
      remoteChunksOutput
    });

    const isLocalChunk = chunkId => {
      var _this$config$localChu;

      return _webpack.default.ModuleFilenameHelpers.matchObject({
        include: (_this$config$localChu = this.config.localChunks) !== null && _this$config$localChu !== void 0 ? _this$config$localChu : []
      }, chunkId);
    };

    let entryGroup;
    const localChunks = [];
    const remoteChunks = [];
    compiler.hooks.compilation.tap('OutputPlugin', compilation => {
      compilation.hooks.processAssets.tap({
        name: 'OutputPlugin',
        stage: _webpack.default.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
      }, () => {
        entryGroup = compilation.chunkGroups.find(group => group.isInitial());
        const sharedChunks = new Set();
        let entryChunk;

        for (const chunk of compilation.chunks) {
          var _entryGroup, _chunk$name, _chunk$id;

          // Do not process shared chunks right now.
          if (sharedChunks.has(chunk)) {
            continue;
          }

          [...chunk.getAllInitialChunks()].filter(sharedChunk => sharedChunk !== chunk).forEach(sharedChunk => {
            sharedChunks.add(sharedChunk);
          }); // Entry chunk

          if (((_entryGroup = entryGroup) === null || _entryGroup === void 0 ? void 0 : _entryGroup.chunks[0]) === chunk) {
            entryChunk = chunk;
            localChunks.push(chunk);
          } else if (isLocalChunk((_chunk$name = chunk.name) !== null && _chunk$name !== void 0 ? _chunk$name : (_chunk$id = chunk.id) === null || _chunk$id === void 0 ? void 0 : _chunk$id.toString())) {
            localChunks.push(chunk);
          } else {
            remoteChunks.push(chunk);
          }
        } // Process shared chunks to add them either as local or remote chunk.


        for (const sharedChunk of sharedChunks) {
          var _sharedChunk$name, _sharedChunk$id;

          const isUsedByLocalChunk = localChunks.some(localChunk => {
            return [...localChunk.getAllInitialChunks()].includes(sharedChunk);
          });

          if (isUsedByLocalChunk || isLocalChunk((_sharedChunk$name = sharedChunk.name) !== null && _sharedChunk$name !== void 0 ? _sharedChunk$name : (_sharedChunk$id = sharedChunk.id) === null || _sharedChunk$id === void 0 ? void 0 : _sharedChunk$id.toString())) {
            localChunks.push(sharedChunk);
          } else {
            remoteChunks.push(sharedChunk);
          }
        }

        if (!entryChunk) {
          throw new Error('Cannot infer entry chunk - this should have not happened.');
        }

        const mainBundleAssetName = [...entryChunk.files][0];
        compilation.updateAsset(mainBundleAssetName, source => new _webpack.default.sources.ConcatSource(`var __CHUNKS__=${JSON.stringify({
          local: localChunks.map(localChunk => {
            var _localChunk$name;

            return (_localChunk$name = localChunk.name) !== null && _localChunk$name !== void 0 ? _localChunk$name : localChunk.id;
          })
        })};`, '\n', source));
      });
    });
    compiler.hooks.afterEmit.tapPromise('OutputPlugin', async compilation => {
      var _remoteChunksOutput, _remoteChunksOutput2;

      const outputPath = compilation.outputOptions.path;

      if (!outputPath) {
        throw new Error('Cannot infer output path from compilation');
      }

      const localAssetsCopyProcessor = new _AssetsCopyProcessor.AssetsCopyProcessor({
        platform: this.config.platform,
        compilation,
        outputPath,
        bundleOutput,
        bundleOutputDir,
        sourcemapOutput,
        assetsDest,
        logger
      });
      const remoteAssetsCopyProcessor = new _AssetsCopyProcessor.AssetsCopyProcessor({
        platform: this.config.platform,
        compilation,
        outputPath,
        bundleOutput: '',
        bundleOutputDir: (_remoteChunksOutput = remoteChunksOutput) !== null && _remoteChunksOutput !== void 0 ? _remoteChunksOutput : '',
        sourcemapOutput: '',
        assetsDest: (_remoteChunksOutput2 = remoteChunksOutput) !== null && _remoteChunksOutput2 !== void 0 ? _remoteChunksOutput2 : '',
        logger
      });

      for (const chunk of localChunks) {
        var _entryGroup2;

        // Process entry chunk
        localAssetsCopyProcessor.enqueueChunk(chunk, {
          isEntry: ((_entryGroup2 = entryGroup) === null || _entryGroup2 === void 0 ? void 0 : _entryGroup2.chunks[0]) === chunk
        });
      }

      if (remoteChunksOutput) {
        for (const chunk of remoteChunks) {
          remoteAssetsCopyProcessor.enqueueChunk(chunk, {
            isEntry: false
          });
        }
      }

      await Promise.all([...localAssetsCopyProcessor.execute(), ...remoteAssetsCopyProcessor.execute()]);
    });
  }

}

exports.OutputPlugin = OutputPlugin;
//# sourceMappingURL=OutputPlugin.js.map