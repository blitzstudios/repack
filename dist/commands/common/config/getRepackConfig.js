"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRepackConfig = getRepackConfig;
function getRepackConfig() {
  return {
    devtool: 'source-map',
    output: {
      clean: true,
      hashFunction: 'xxhash64',
      filename: 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
      path: '[context]/build/generated/[platform]',
      publicPath: 'noop:///'
    },
    optimization: {
      chunkIds: 'named'
    }
  };
}
//# sourceMappingURL=getRepackConfig.js.map