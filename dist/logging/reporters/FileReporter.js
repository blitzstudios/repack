"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileReporter = void 0;
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _throttleit = _interopRequireDefault(require("throttleit"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class FileReporter {
  buffer = ['\n\n--- BEGINNING OF NEW LOG ---\n'];
  constructor(config) {
    this.config = config;
    if (!_nodePath.default.isAbsolute(this.config.filename)) {
      this.config.filename = _nodePath.default.join(process.cwd(), this.config.filename);
    }
    _nodeFs.default.mkdirSync(_nodePath.default.dirname(this.config.filename), {
      recursive: true
    });
  }
  throttledFlush = (0, _throttleit.default)(() => {
    this.flush();
  }, 1000);
  process(log) {
    this.buffer.push(JSON.stringify(log));
    this.throttledFlush();
  }
  flush() {
    if (!this.buffer.length) {
      return;
    }
    _nodeFs.default.writeFileSync(this.config.filename, this.buffer.join('\n'), {
      flag: 'a'
    });
    this.buffer = [];
  }
  stop() {
    this.flush();
  }
}
exports.FileReporter = FileReporter;
//# sourceMappingURL=FileReporter.js.map