"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetPersistentCache = resetPersistentCache;
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
var colorette = _interopRequireWildcard(require("colorette"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function getDefaultCacheDirectory(bundler, rootDir) {
  const defaultCacheDir = _nodePath.default.join('node_modules', '.cache', bundler);
  return _nodePath.default.join(rootDir, defaultCacheDir);
}
function getCustomCacheDirectory(candidate, rootDir) {
  if (_nodePath.default.isAbsolute(candidate)) return candidate;
  return _nodePath.default.resolve(rootDir, candidate);
}
function getRspackCachePaths(rootDir, cacheConfigs) {
  const cachePaths = new Set();
  for (const cacheConfig of cacheConfigs) {
    if (typeof cacheConfig === 'object' && 'storage' in cacheConfig && cacheConfig.storage?.directory) {
      const candidateDir = cacheConfig.storage.directory;
      cachePaths.add(getCustomCacheDirectory(candidateDir, rootDir));
    } else {
      cachePaths.add(getDefaultCacheDirectory('rspack', rootDir));
    }
  }
  return cachePaths;
}
function getWebpackCachePaths(rootDir, cacheConfigs) {
  const cachePaths = new Set();
  for (const cacheConfig of cacheConfigs) {
    if (typeof cacheConfig === 'object' && 'cacheLocation' in cacheConfig && cacheConfig.cacheLocation) {
      const candidateDir = _nodePath.default.dirname(cacheConfig.cacheLocation);
      cachePaths.add(getCustomCacheDirectory(candidateDir, rootDir));
    } else if (typeof cacheConfig === 'object' && 'cacheDirectory' in cacheConfig && cacheConfig.cacheDirectory) {
      const candidateDir = cacheConfig.cacheDirectory;
      cachePaths.add(getCustomCacheDirectory(candidateDir, rootDir));
    } else {
      cachePaths.add(getDefaultCacheDirectory('webpack', rootDir));
    }
  }
  return cachePaths;
}
function resetPersistentCache({
  bundler,
  rootDir,
  cacheConfigs
}) {
  const cachePaths = bundler === 'rspack' ? getRspackCachePaths(rootDir, cacheConfigs) : getWebpackCachePaths(rootDir, cacheConfigs);
  const warn = msg => console.warn(colorette.yellow(msg));
  for (const cachePath of cachePaths) {
    if (!_nodeFs.default.existsSync(cachePath)) continue;
    const relativeCachePath = _nodePath.default.relative(rootDir, cachePath);
    if (relativeCachePath.startsWith('..')) {
      warn(`Cache path "${relativeCachePath}" is outside of the project directory. ` + 'Resetting cache outside of the project directory is not supported. ' + 'Please delete the cache directory manually.\n');
      continue;
    }
    try {
      _nodeFs.default.rmSync(cachePath, {
        recursive: true
      });
      warn(`Deleted transformation cache at ${relativeCachePath}\n`);
    } catch {
      warn(`Failed to delete cache at ${relativeCachePath}\n`);
    }
  }
}