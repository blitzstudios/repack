"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bundle = bundle;

var _webpack = _interopRequireDefault(require("webpack"));

var _env = require("../env");

var _loadWebpackConfig = require("../webpack/loadWebpackConfig");

var _utils = require("../webpack/utils");

var _getWebpackConfigPath = require("./utils/getWebpackConfigPath");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Bundle command for React Native CLI.
 * It runs Webpack, builds bundle and saves it alongside any other assets and Source Map
 * to filesystem.
 *
 * @param _ Original, non-parsed arguments that were provided when running this command.
 * @param config React Native CLI configuration object.
 * @param args Parsed command line arguments.
 *
 * @internal
 * @category CLI command
 */
async function bundle(_, config, args) {
  const webpackConfigPath = (0, _getWebpackConfigPath.getWebpackConfigPath)(config.root, args.webpackConfig);
  const cliOptions = {
    config: {
      root: config.root,
      reactNativePath: config.reactNativePath,
      webpackConfigPath
    },
    command: 'bundle',
    arguments: {
      bundle: args
    }
  };

  if (args.verbose ?? process.argv.includes('--verbose')) {
    process.env[_env.VERBOSE_ENV_KEY] = '1';
  }

  const webpackEnvOptions = (0, _utils.getWebpackEnvOptions)(cliOptions);
  const webpackConfig = await (0, _loadWebpackConfig.loadWebpackConfig)(webpackConfigPath, webpackEnvOptions);
  const compiler = (0, _webpack.default)(webpackConfig);
  return new Promise((resolve, reject) => {
    compiler.run(error => {
      if (error) {
        reject();
        console.error(error);
        process.exit(2);
      } else {
        resolve();
      }
    });
  });
}
//# sourceMappingURL=bundle.js.map