"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEnvOptions = getEnvOptions;
var _nodePath = _interopRequireDefault(require("node:path"));
var _consts = require("../../consts.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function getEnvOptions(opts) {
  const env = {
    context: opts.rootDir,
    reactNativePath: opts.reactNativePath
  };
  if (opts.command === 'bundle') {
    const bundleArgs = opts.args;
    env.mode = bundleArgs.dev ? 'development' : 'production';
    env.platform = bundleArgs.platform;
    env.minimize = bundleArgs.minify ?? env.mode === 'production';
    const {
      entryFile
    } = bundleArgs;
    if (entryFile) {
      env.entry = _nodePath.default.isAbsolute(entryFile) || entryFile.startsWith('./') ? entryFile : `./${entryFile}`;
    }
    env.bundleFilename = bundleArgs.bundleOutput;
    env.sourceMapFilename = bundleArgs.sourcemapOutput;
    env.assetsPath = bundleArgs.assetsDest;
  } else {
    const startArgs = opts.args;
    env.mode = 'development';
    env.devServer = {
      port: startArgs.port ?? _consts.DEFAULT_PORT,
      host: startArgs.host || _consts.DEFAULT_HOSTNAME,
      https: startArgs.https ? {
        cert: startArgs.cert,
        key: startArgs.key
      } : undefined,
      hmr: true
    };
  }
  return env;
}
//# sourceMappingURL=getEnvOptions.js.map