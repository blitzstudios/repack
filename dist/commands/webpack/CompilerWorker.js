"use strict";

var _nodePath = _interopRequireDefault(require("node:path"));
var _nodeWorker_threads = require("node:worker_threads");
var _memfs = _interopRequireDefault(require("memfs"));
var _webpack = _interopRequireDefault(require("webpack"));
var _index = require("../../helpers/index.js");
var _makeCompilerConfig = require("../common/config/makeCompilerConfig.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function postMessage(message) {
  _nodeWorker_threads.parentPort?.postMessage(message);
}
async function main(opts) {
  const [config] = await (0, _makeCompilerConfig.makeCompilerConfig)({
    args: opts.args,
    bundler: 'webpack',
    command: 'start',
    rootDir: opts.rootDir,
    platforms: [opts.platform],
    reactNativePath: opts.reactNativePath
  });
  config.plugins = (config.plugins ?? []).concat(new _webpack.default.ProgressPlugin(percentage => {
    postMessage({
      event: 'progress',
      percentage: percentage
    });
  }));
  const compiler = (0, _webpack.default)(config);
  const fileSystem = _memfs.default.createFsFromVolume(new _memfs.default.Volume());

  // @ts-expect-error memfs is compatible enough
  compiler.outputFileSystem = fileSystem;
  compiler?.hooks.watchRun.tap('webpackWorker', () => {
    postMessage({
      event: 'watchRun'
    });
  });
  compiler?.hooks.invalid.tap('webpackWorker', () => {
    postMessage({
      event: 'invalid'
    });
  });
  compiler?.hooks.done.tap('webpackWorker', stats => {
    const compilerStats = stats.toJson({
      all: false,
      assets: true,
      children: true,
      outputPath: true,
      timings: true,
      hash: true,
      errors: true,
      warnings: true
    });
    const assets = compilerStats.assets;
    const outputDirectory = compilerStats.outputPath;
    const compilerAssets = assets.filter(asset => asset.type === 'asset').reduce((acc, {
      name,
      info,
      size
    }) => {
      const assetPath = _nodePath.default.join(outputDirectory, name);
      const data = fileSystem.readFileSync(assetPath);
      const asset = {
        data,
        info,
        size
      };
      acc[(0, _index.adaptFilenameToPlatform)(name)] = asset;
      if (info.related?.sourceMap) {
        const sourceMapName = Array.isArray(info.related.sourceMap) ? info.related.sourceMap[0] : info.related.sourceMap;
        const sourceMapPath = _nodePath.default.join(outputDirectory, sourceMapName);
        const sourceMapData = fileSystem.readFileSync(sourceMapPath);
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
    }, {});
    postMessage({
      event: 'done',
      assets: {
        ...compilerAssets
      },
      stats: compilerStats
    });
  });
  compiler?.watch(config.watchOptions ?? {}, error => {
    if (error) {
      postMessage({
        event: 'error',
        error
      });
    }
  });
}
main(_nodeWorker_threads.workerData).catch(error => {
  postMessage({
    event: 'error',
    error
  });
  process.exit(1);
});