"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileReporter = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _lodash = _interopRequireDefault(require("lodash.throttle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FileReporter {
  buffer = ['\n\n--- BEGINNING OF NEW LOG ---\n'];

  constructor(config) {
    this.config = config;

    if (!_path.default.isAbsolute(this.config.filename)) {
      this.config.filename = _path.default.join(process.cwd(), this.config.filename);
    }

    _fs.default.mkdirSync(_path.default.dirname(this.config.filename), {
      recursive: true
    });
  }

  throttledFlush = (0, _lodash.default)(() => {
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

    _fs.default.writeFileSync(this.config.filename, this.buffer.join('\n'), {
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