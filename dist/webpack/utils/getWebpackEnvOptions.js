"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWebpackEnvOptions = getWebpackEnvOptions;

var _path = _interopRequireDefault(require("path"));

var _env = require("../../env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getWebpackEnvOptions(cliOptions) {
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
    env.entry = _path.default.isAbsolute(entryFile) || entryFile.startsWith('./') ? entryFile : `./${entryFile}`;
    env.bundleFilename = cliOptions.arguments.bundle.bundleOutput;
    env.sourceMapFilename = cliOptions.arguments.bundle.sourcemapOutput;
    env.assetsPath = cliOptions.arguments.bundle.assetsDest;
  } else {
    env.mode = 'development';
    env.platform = cliOptions.arguments.start.platform || undefined;
    env.devServer = {
      port: cliOptions.arguments.start.port ?? _env.DEFAULT_PORT,
      host: cliOptions.arguments.start.host,
      https: cliOptions.arguments.start.https ? {
        cert: cliOptions.arguments.start.cert,
        key: cliOptions.arguments.start.key
      } : undefined,
      hmr: true
    };
  }

  return env;
}
//# sourceMappingURL=getWebpackEnvOptions.js.map