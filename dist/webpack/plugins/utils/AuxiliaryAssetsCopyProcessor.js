"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuxiliaryAssetsCopyProcessor = void 0;

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AuxiliaryAssetsCopyProcessor {
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

  enqueueAsset(asset) {
    const {
      outputPath,
      assetsDest
    } = this.config;
    this.queue.push(() => this.copyAsset(_path.default.join(outputPath, asset), _path.default.join(assetsDest, asset)));
  }

  execute() {
    const queue = this.queue;
    this.queue = [];
    return queue.map(work => work());
  }

}

exports.AuxiliaryAssetsCopyProcessor = AuxiliaryAssetsCopyProcessor;
//# sourceMappingURL=AuxiliaryAssetsCopyProcessor.js.map