"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCliOverrides = getCliOverrides;
var _nodePath = _interopRequireDefault(require("node:path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function normalizeEntryFile(entryFile) {
  return _nodePath.default.isAbsolute(entryFile) || entryFile.startsWith('./') ? entryFile : `./${entryFile}`;
}
function getCliOverrides(opts) {
  const overrides = {};
  if (opts.command === 'bundle') {
    const bundleArgs = opts.args;
    overrides.mode = bundleArgs.dev ? 'development' : 'production';
    overrides.optimization = {
      minimize: bundleArgs.minify
    };
    overrides.entry = normalizeEntryFile(bundleArgs.entryFile);
  } else {
    const startArgs = opts.args;
    overrides.devServer = {
      port: startArgs.port,
      host: startArgs.host || undefined,
      server: startArgs.https ? {
        type: 'https',
        options: {
          key: startArgs.key,
          cert: startArgs.cert
        }
      } : undefined
    };
  }
  return overrides;
}