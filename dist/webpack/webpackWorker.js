"use strict";

var _worker_threads = require("worker_threads");

var _path = _interopRequireDefault(require("path"));

var _webpack = _interopRequireDefault(require("webpack"));

var _memfs = _interopRequireDefault(require("memfs"));

var _utils = require("./utils");

var _loadWebpackConfig = require("./loadWebpackConfig");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function main(cliOptions) {
  const webpackEnvOptions = (0, _utils.getWebpackEnvOptions)(cliOptions);
  const webpackConfig = await (0, _loadWebpackConfig.loadWebpackConfig)(cliOptions.config.webpackConfigPath, webpackEnvOptions);
  const watchOptions = webpackConfig.watchOptions ?? {};
  webpackConfig.plugins = (webpackConfig.plugins ?? []).concat(new _webpack.default.ProgressPlugin((_1, _2, message) => {
    const [, completed, total] = /(\d+)\/(\d+) modules/.exec(message) ?? [];

    if (completed !== undefined && total !== undefined) {
      _worker_threads.parentPort === null || _worker_threads.parentPort === void 0 ? void 0 : _worker_threads.parentPort.postMessage({
        event: 'progress',
        completed: parseInt(completed, 10),
        total: parseInt(total, 10),
        message
      });
    }
  }));
  const compiler = (0, _webpack.default)(webpackConfig);

  const fileSystem = _memfs.default.createFsFromVolume(new _memfs.default.Volume());

  compiler.outputFileSystem = fileSystem;
  compiler.hooks.watchRun.tap('webpackWorker', () => {
    _worker_threads.parentPort === null || _worker_threads.parentPort === void 0 ? void 0 : _worker_threads.parentPort.postMessage({
      event: 'watchRun'
    });
  });
  compiler.hooks.invalid.tap('webpackWorker', () => {
    _worker_threads.parentPort === null || _worker_threads.parentPort === void 0 ? void 0 : _worker_threads.parentPort.postMessage({
      event: 'invalid'
    });
  });
  compiler.hooks.done.tap('webpackWorker', stats => {
    const outputDirectory = stats.compilation.outputOptions.path;
    const assets = stats.compilation.getAssets().map(asset => {
      const data = fileSystem.readFileSync(_path.default.join(outputDirectory, asset.name));
      return {
        filename: asset.name,
        data,
        info: asset.info
      };
    });
    _worker_threads.parentPort === null || _worker_threads.parentPort === void 0 ? void 0 : _worker_threads.parentPort.postMessage({
      event: 'done',
      assets,
      stats: stats.toJson({
        all: false,
        cached: true,
        children: true,
        modules: true,
        timings: true,
        hash: true,
        errors: true,
        warnings: false
      })
    }, assets.map(asset => asset.data.buffer));
  });
  compiler.watch(watchOptions, error => {
    if (error) {
      _worker_threads.parentPort === null || _worker_threads.parentPort === void 0 ? void 0 : _worker_threads.parentPort.postMessage({
        event: 'error',
        error
      });
    }
  });
}

main(_worker_threads.workerData).catch(error => {
  _worker_threads.parentPort === null || _worker_threads.parentPort === void 0 ? void 0 : _worker_threads.parentPort.postMessage({
    event: 'error',
    error
  });
  process.exit(1);
});
//# sourceMappingURL=webpackWorker.js.map