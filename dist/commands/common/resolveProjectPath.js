"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveProjectPath = resolveProjectPath;
var _nodePath = _interopRequireDefault(require("node:path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const projectRootPattern = /^\[projectRoot(?:\^(\d+))?\]$/;
function isProjectPath(filepath) {
  const root = filepath.split('/')[0];
  return root.match(projectRootPattern);
}

// Resolve [projectRoot] and [projectRoot^N] prefixes
function resolveProjectPath(filepath, rootDir) {
  const match = isProjectPath(filepath);
  if (!match) return filepath;
  const [prefix, upLevels] = match;
  const upPath = '../'.repeat(Number(upLevels ?? 0));
  const rootPath = _nodePath.default.join(rootDir, upPath);
  return _nodePath.default.resolve(filepath.replace(prefix, rootPath));
}