"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEnvOptions = getEnvOptions;
var _nodePath = _interopRequireDefault(require("node:path"));
var _consts = require("../consts");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function getEnvOptions(cliOptions) {
  const env = {
    bundleFilename: ''
  };
  env.context = cliOptions.config.root;
  env.reactNativePath = cliOptions.config.reactNativePath;
  if ('bundle' in cliOptions.arguments) {
    env.mode = cliOptions.arguments.bundle.dev ? 'development' : 'production';
    env.platform = cliOptions.arguments.bundle.platform;
    env.minimize = cliOptions.arguments.bundle.minify ?? env.mode === 'production';
    const {
      entryFile
    } = cliOptions.arguments.bundle;
    env.entry = _nodePath.default.isAbsolute(entryFile) || entryFile.startsWith('./') ? entryFile : `./${entryFile}`;
    env.bundleFilename = cliOptions.arguments.bundle.bundleOutput;
    env.sourceMapFilename = cliOptions.arguments.bundle.sourcemapOutput;
    env.assetsPath = cliOptions.arguments.bundle.assetsDest;
  } else {
    env.mode = 'development';
    env.devServer = {
      port: cliOptions.arguments.start.port ?? _consts.DEFAULT_PORT,
      host: cliOptions.arguments.start.host || _consts.DEFAULT_HOSTNAME,
      https: cliOptions.arguments.start.https ? {
        cert: cliOptions.arguments.start.cert,
        key: cliOptions.arguments.start.key
      } : undefined,
      hmr: true
    };
  }
  return env;
}
//# sourceMappingURL=getEnvOptions.js.map