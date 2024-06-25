"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bundle = bundle;
var _fsExtra = _interopRequireDefault(require("fs-extra"));
var _jsonExt = require("@discoveryjs/json-ext");
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
    compiler.run((error, stats) => {
      if (error) {
        reject();
        console.error(error);
        process.exit(2);
      } else {
        if (stats?.hasErrors()) {
          reject();
          stats.compilation?.errors?.forEach(e => {
            console.error(e);
          });
          process.exit(2);
        }
        if (args.json && stats !== undefined) {
          console.log(`Writing compiler stats`);
          let statOptions;
          if (args.stats !== undefined) {
            statOptions = {
              preset: args.stats
            };
          } else if (typeof compiler.options.stats === 'boolean') {
            statOptions = compiler.options.stats ? {
              preset: 'normal'
            } : {
              preset: 'none'
            };
          } else {
            statOptions = compiler.options.stats;
          }
          const statsJson = stats.toJson(statOptions);
          // Stats can be fairly big at which point their JSON no longer fits into a single string.
          // Approach was copied from `webpack-cli`: https://github.com/webpack/webpack-cli/blob/c03fb03d0aa73d21f16bd9263fd3109efaf0cd28/packages/webpack-cli/src/webpack-cli.ts#L2471-L2482
          const outputStream = _fsExtra.default.createWriteStream(args.json);
          (0, _jsonExt.stringifyStream)(statsJson).on('error', error => {
            reject();
            console.error(error);
            process.exit(2);
          }).pipe(outputStream).on('error', error => {
            reject();
            console.error(error);
            process.exit(2);
          }).on('close', () => {
            console.log(`Wrote compiler stats to ${args.json}`);
            resolve();
          });
        } else {
          resolve();
        }
      }
    });
    // eslint-disable-next-line promise/prefer-await-to-then
  }).then(() => {
    return new Promise((resolve, reject) => {
      // make cache work: https://webpack.js.org/api/node/#run
      compiler.close(error => {
        if (error) {
          reject();
        } else {
          resolve();
        }
      });
    });
  });
}
//# sourceMappingURL=bundle.js.map