"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuxiliaryAssetsCopyProcessor = void 0;
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class AuxiliaryAssetsCopyProcessor {
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
  enqueueAsset(asset) {
    const {
      outputPath,
      assetsDest
    } = this.config;
    this.queue.push(() => this.copyAsset(_nodePath.default.join(outputPath, asset), _nodePath.default.join(assetsDest, asset)));
  }
  execute() {
    const queue = this.queue;
    this.queue = [];
    return queue.map(work => work());
  }
}
exports.AuxiliaryAssetsCopyProcessor = AuxiliaryAssetsCopyProcessor;