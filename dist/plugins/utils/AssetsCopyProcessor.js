"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssetsCopyProcessor = void 0;
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class AssetsCopyProcessor {
  queue = [];
  constructor(config, filesystem = _nodeFs.default) {
    this.config = config;
    this.filesystem = filesystem;
  }
  async copyAsset(from, to) {
    this.config.logger.debug('Copying asset:', from, 'to:', to);
    await this.filesystem.promises.mkdir(_nodePath.default.dirname(to), {
      recursive: true
    });
    await this.filesystem.promises.copyFile(from, to);
  }
  enqueueChunk(chunk, {
    isEntry,
    sourceMapFile
  }) {
    const {
      outputPath,
      bundleOutput,
      sourcemapOutput,
      bundleOutputDir,
      assetsDest,
      platform
    } = this.config;
    const sourcemapOutputDir = sourcemapOutput ? _nodePath.default.dirname(sourcemapOutput) : bundleOutputDir;

    // Chunk bundle e.g: `index.bundle`, `src_App_js.chunk.bundle`
    // There might be more than 1 file associated with the chunk -
    // this happens e.g. on web when importing CSS files into JS.
    // TBD whether this can ever occur in React Native.
    const chunkFile = chunk.files?.[0];

    // Sometimes there are no files associated with the chunk and the OutputPlugin fails
    // Skipping such chunks is a temporary workaround resulting in proper behaviour
    // This can happen when Module Federation is used and some chunks are not emitted
    // and are only used as temporary during compilation.
    if (!chunkFile) {
      return;
    }

    // Target file path where to save the bundle.
    const bundleDestination = isEntry ? bundleOutput : _nodePath.default.join(platform === 'ios' ? assetsDest : bundleOutputDir, chunkFile);

    // Target file path where to save the source map file.
    const sourceMapDestination = isEntry ? sourcemapOutput : _nodePath.default.join(platform === 'ios' ? assetsDest : sourcemapOutputDir, sourceMapFile ?? '');

    // Entry chunks (main/index bundle) need to be processed differently to
    // adjust file name and the content of source mapping info to match values provided by:
    // - `--bundle-output` -> `bundleOutput`
    // - `--sourcemap-output` -> `sourcemapOutput`
    const shouldOverrideMappingInfo = isEntry && sourceMapFile;

    // Absolute path to chunk bundle file saved in `output.path`
    const chunkSource = _nodePath.default.join(outputPath, chunkFile);

    // If chunk is an entry chunk, meaning it's a main/index bundle,
    // save it based on `bundleDestination` and overwrite `sourceMappingURL`
    // to point to correct file name (e.g: `index.bundle.map` -> `main.jsbundle.map`).
    // Otherwise, simply copy the file to it's target `bundleDestination`.
    if (shouldOverrideMappingInfo) {
      this.queue.push(async () => {
        const bundleContent = await this.filesystem.promises.readFile(chunkSource, 'utf-8');
        await this.filesystem.promises.mkdir(_nodePath.default.dirname(bundleDestination), {
          recursive: true
        });
        await this.filesystem.promises.writeFile(bundleDestination, bundleContent.replace(/\/\/# sourceMappingURL=.*$/, `//# sourceMappingURL=${_nodePath.default.basename(sourceMapDestination)}`));
      });
    } else {
      this.queue.push(() => this.copyAsset(chunkSource, bundleDestination));
    }
    if (sourceMapFile) {
      const sourceMapSource = _nodePath.default.join(outputPath, sourceMapFile);

      // If chunk is an entry chunk, meaning it's a main/index bundle,
      // save the source map file for it based on `sourceMapDestination` and values inside it,
      // to point to a correct bundle file name (e.g: `index.bundle` -> `main.jsbundle`).
      // Otherwise, simply copy the file to it's target `sourceMapDestination`.
      if (isEntry) {
        this.queue.push(async () => {
          const sourceMapContent = await this.filesystem.promises.readFile(sourceMapSource, 'utf-8');
          await this.filesystem.promises.mkdir(_nodePath.default.dirname(sourceMapDestination), {
            recursive: true
          });
          await this.filesystem.promises.writeFile(sourceMapDestination, sourceMapContent.replace(chunkFile, _nodePath.default.basename(bundleDestination)));
        });
      } else {
        this.queue.push(() => this.copyAsset(sourceMapSource, sourceMapDestination));
      }
    }

    // Copy regular assets
    const mediaAssets = [...chunk.auxiliaryFiles].filter(file => !/\.(map|bundle\.json)$/.test(file)).filter(file => !/^remote-assets/.test(file));
    this.queue.push(...mediaAssets.map(asset => () => this.copyAsset(_nodePath.default.join(outputPath, asset), _nodePath.default.join(assetsDest, asset))));

    // Manifest file name e.g: `index.bundle.json`, src_App_js.chunk.bundle.json`
    const [manifest] = [...chunk.auxiliaryFiles].filter(file => /\.bundle\.json$/.test(file));
    if (manifest) {
      const manifestSource = _nodePath.default.join(outputPath, manifest);
      const manifestDestination = _nodePath.default.join(platform === 'ios' ? assetsDest : bundleOutputDir, isEntry ? `${_nodePath.default.basename(bundleDestination)}.json` : manifest);

      // If chunk is an entry chunk, meaning it's a main bundle,
      // adjust chunk and source map names inside the manifest (e.g: `index.bundle` -> `main.jsbundle`,
      // `index.bundle.map` -> `main.jsbundle.map`).
      // Otherwise, simply copy the manifest.
      if (isEntry) {
        this.queue.push(async () => {
          const manifestContent = await this.filesystem.promises.readFile(manifestSource, 'utf-8');
          await this.filesystem.promises.mkdir(_nodePath.default.dirname(manifestDestination), {
            recursive: true
          });
          await this.filesystem.promises.writeFile(manifestDestination, manifestContent.replace(chunkFile, _nodePath.default.basename(bundleDestination)).replace(sourceMapFile ?? /.^/, _nodePath.default.basename(sourceMapDestination)));
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