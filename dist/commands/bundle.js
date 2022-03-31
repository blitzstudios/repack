"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bundle = bundle;

var _webpack = _interopRequireDefault(require("webpack"));

var _env = require("../env");

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
function bundle(_, config, args) {
  const webpackConfigPath = (0, _getWebpackConfigPath.getWebpackConfigPath)(config.root, args.webpackConfig);
  const cliOptions = JSON.stringify({
    config: {
      root: config.root,
      reactNativePath: config.reactNativePath,
      webpackConfigPath
    },
    command: 'bundle',
    arguments: {
      bundle: args
    }
  });
  process.env[_env.CLI_OPTIONS_ENV_KEY] = cliOptions;

  if (process.argv.includes('--verbose')) {
    process.env[_env.VERBOSE_ENV_KEY] = '1';
  }

  const compiler = (0, _webpack.default)(require(webpackConfigPath));
  compiler.run(error => {
    if (error) {
      console.error(error);
      process.exit(2);
    }
  });
}
//# sourceMappingURL=bundle.js.map