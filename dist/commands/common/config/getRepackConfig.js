"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRepackConfig = getRepackConfig;
var _getMinimizerConfig = require("./getMinimizerConfig.js");
function getExperimentsConfig(bundler) {
  if (bundler === 'rspack') {
    return {
      parallelLoader: true
    };
  }
}
async function getRepackConfig(bundler, rootDir) {
  const experiments = getExperimentsConfig(bundler);
  const minimizerConfiguration = await (0, _getMinimizerConfig.getMinimizerConfig)(bundler, rootDir);
  return {
    devtool: 'source-map',
    experiments,
    output: {
      clean: true,
      hashFunction: 'xxhash64',
      filename: 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
      path: '[context]/build/generated/[platform]',
      publicPath: 'noop:///'
    },
    optimization: {
      chunkIds: 'named',
      minimizer: minimizerConfiguration
    }
  };
}