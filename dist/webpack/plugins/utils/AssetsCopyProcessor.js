"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssetsCopyProcessor = void 0;

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AssetsCopyProcessor {
  queue = [];

  constructor(config, filesystem = _fsExtra.default) {
    this.config = config;
    this.filesystem = filesystem;
  }

  async copyAsset(from, to) {
    this.config.logger.debug('Copying asset:', from, 'to:', to);
    await this.filesystem.ensureDir(_path.default.dirname(to));
    await this.filesystem.copyFile(from, to);
  }

  enqueueChunk(chunk, {
    isEntry
  }) {
    var _compilation$assetsIn, _compilation$assetsIn2;

    const {
      compilation,
      outputPath,
      bundleOutput,
      sourcemapOutput,
      bundleOutputDir,
      assetsDest,
      platform
    } = this.config;
    const sourcemapOutputDir = sourcemapOutput ? _path.default.dirname(sourcemapOutput) : bundleOutputDir; // Chunk bundle e.g: `index.bundle`, `src_App_js.chunk.bundle`

    const [chunkFile] = [...chunk.files]; // Sometimes there are no files associated with the chunk and the OutputPlugin fails
    // Skipping such chunks is a temporary workaround resulting in proper behaviour
    // TODO: determine the real cause of this issue

    if (!chunkFile) {
      return;
    }

    const relatedSourceMap = (_compilation$assetsIn = compilation.assetsInfo.get(chunkFile)) === null || _compilation$assetsIn === void 0 ? void 0 : (_compilation$assetsIn2 = _compilation$assetsIn.related) === null || _compilation$assetsIn2 === void 0 ? void 0 : _compilation$assetsIn2.sourceMap; // Source map for the chunk e.g: `index.bundle.map`, `src_App_js.chunk.bundle.map`

    const sourceMapFile = Array.isArray(relatedSourceMap) ? relatedSourceMap[0] : relatedSourceMap; // Target file path where to save the bundle.

    const bundleDestination = isEntry ? bundleOutput : _path.default.join(platform === 'ios' ? assetsDest : bundleOutputDir, chunkFile); // Target file path where to save the source map file.

    const sourceMapDestination = isEntry ? sourcemapOutput : _path.default.join(platform === 'ios' ? assetsDest : sourcemapOutputDir, sourceMapFile ?? ''); // Entry chunks (main/index bundle) need to be processed differently to
    // adjust file name and the content of source mapping info to match values provided by:
    // - `--bundle-output` -> `bundleOutput`
    // - `--sourcemap-output` -> `sourcemapOutput`

    const shouldOverrideMappingInfo = isEntry && sourceMapFile; // Absolute path to chunk bundle file saved in `output.path`

    const chunkSource = _path.default.join(outputPath, chunkFile); // If chunk is an entry chunk, meaning it's a main/index bundle,
    // save it based on `bundleDestination` and overwrite `sourceMappingURL`
    // to point to correct file name (e.g: `index.bundle.map` -> `main.jsbundle.map`).
    // Otherwise, simply copy the file to it's target `bundleDestination`.


    if (shouldOverrideMappingInfo) {
      this.queue.push(async () => {
        const bundleContent = await this.filesystem.readFile(chunkSource, 'utf-8');
        await this.filesystem.ensureDir(_path.default.dirname(bundleDestination));
        await this.filesystem.writeFile(bundleDestination, bundleContent.replace(/\/\/# sourceMappingURL=.*$/, `//# sourceMappingURL=${_path.default.basename(sourceMapDestination)}`));
      });
    } else {
      this.queue.push(() => this.copyAsset(chunkSource, bundleDestination));
    }

    if (sourceMapFile) {
      const sourceMapSource = _path.default.join(outputPath, sourceMapFile); // If chunk is an entry chunk, meaning it's a main/index bundle,
      // save the source map file for it based on `sourceMapDestination` and values inside it,
      // to point to a correct bundle file name (e.g: `index.bundle` -> `main.jsbundle`).
      // Otherwise, simply copy the file to it's target `sourceMapDestination`.


      if (isEntry) {
        this.queue.push(async () => {
          const sourceMapContent = await this.filesystem.readFile(sourceMapSource, 'utf-8');
          await this.filesystem.ensureDir(_path.default.dirname(sourceMapDestination));
          await this.filesystem.writeFile(sourceMapDestination, sourceMapContent.replace(chunkFile, _path.default.basename(bundleDestination)));
        });
      } else {
        this.queue.push(() => this.copyAsset(sourceMapSource, sourceMapDestination));
      }
    } // Copy regular assets


    const mediaAssets = [...chunk.auxiliaryFiles].filter(file => !/\.(map|bundle\.json)$/.test(file)).filter(file => !/^remote-assets/.test(file));
    this.queue.push(...mediaAssets.map(asset => () => this.copyAsset(_path.default.join(outputPath, asset), _path.default.join(assetsDest, asset)))); // Manifest file name e.g: `index.bundle.json`, src_App_js.chunk.bundle.json`

    const [manifest] = [...chunk.auxiliaryFiles].filter(file => /\.bundle\.json$/.test(file));

    if (manifest) {
      const manifestSource = _path.default.join(outputPath, manifest);

      const manifestDestination = _path.default.join(platform === 'ios' ? assetsDest : bundleOutputDir, isEntry ? `${_path.default.basename(bundleDestination)}.json` : manifest); // If chunk is an entry chunk, meaning it's a main bundle,
      // adjust chunk and source map names inside the manifest (e.g: `index.bundle` -> `main.jsbundle`,
      // `index.bundle.map` -> `main.jsbundle.map`).
      // Otherwise, simply copy the manifest.


      if (isEntry) {
        this.queue.push(async () => {
          const manifestContent = await this.filesystem.readFile(manifestSource, 'utf-8');
          await this.filesystem.ensureDir(_path.default.dirname(manifestDestination));
          await this.filesystem.writeFile(manifestDestination, manifestContent.replace(chunkFile, _path.default.basename(bundleDestination)).replace(sourceMapFile ?? /.^/, _path.default.basename(sourceMapDestination)));
        });
      } else {
        this.queue.push(() => this.copyAsset(manifestSource, manifestDestination));
      }
    }
  }

  execute() {
    const queue = this.queue;
    this.queue = [];
    return queue.map(work => work());
  }

}

exports.AssetsCopyProcessor = AssetsCopyProcessor;
//# sourceMappingURL=AssetsCopyProcessor.js.map