"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FsNode {
  constructor(path) {
    this.path = path;
  }

  makeDir() {
    if (this.value !== undefined) {
      throw new Error('Node is already a file');
    }

    if (!this.children) {
      this.children = [];
    }
  }

  makeFile(value) {
    if (this.children) {
      throw new Error('Node is already a directory');
    }

    this.value = value;
  }

  findDir(dirname, create = false) {
    if (this.value !== undefined || this.children == undefined) {
      throw new Error('not a directory');
    }

    const [currentSegment, ...segments] = dirname.split(_path.default.sep);

    if (currentSegment === '.') {
      return this;
    }

    let foundDir;

    for (const child of this.children) {
      if (child.children && child.path === currentSegment) {
        foundDir = child.findDir(_path.default.join(...segments), create);
      }
    }

    if (!foundDir) {
      if (create) {
        const child = new FsNode(currentSegment);
        child.makeDir();
        this.children.push(child);
        foundDir = child.findDir(_path.default.join(...segments), create);
      } else {
        throw new Error(`directory does not exist: ${dirname}`);
      }
    }

    return foundDir;
  }

}

class FsMock {
  constructor() {
    this.fs = new FsNode('/');
    this.fs.makeDir();
  }

  async ensureDir(dirname) {
    const [, ...segments] = dirname.split(_path.default.sep);
    this.fs.findDir(_path.default.join(...segments), true);
  }

  async copyFile(from, to) {
    const content = await this.readFile(from);
    await this.writeFile(to, content);
  }

  async readFile(filePath) {
    const [, ...segments] = _path.default.dirname(filePath).split(_path.default.sep);

    const dirname = _path.default.join(...segments);

    const basename = _path.default.basename(filePath);

    const dirNode = this.fs.findDir(dirname);

    for (const child of dirNode.children ?? []) {
      if (child.path === basename) {
        if (child.value === undefined) {
          throw new Error('not a file');
        }

        return child.value;
      }
    }

    throw new Error(`no such file: ${filePath}`);
  }

  async writeFile(filePath, value) {
    const [, ...segments] = _path.default.dirname(filePath).split(_path.default.sep);

    const dirname = _path.default.join(...segments);

    const basename = _path.default.basename(filePath);

    const dirNode = this.fs.findDir(dirname);
    let found = false;

    for (const child of dirNode.children ?? []) {
      if (child.path === basename) {
        if (child.children !== undefined) {
          throw new Error(`not a file: ${filePath}`);
        }

        child.value = value;
        found = true;
        break;
      }
    }

    if (!found) {
      const file = new FsNode(basename);
      file.makeFile(value);
      dirNode.children.push(file);
    }
  }

}

var _default = new FsMock();

exports.default = _default;
//# sourceMappingURL=fs-extra.js.map