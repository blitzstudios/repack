"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bundle = bundle;
var _webpack = _interopRequireDefault(require("webpack"));
var _env = require("../../env");
var _common = require("../common");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Bundle command for React Native Community CLI.
 * It runs Webpack, builds bundle and saves it alongside any other assets and Source Map
 * to filesystem.
 *
 * @param _ Original, non-parsed arguments that were provided when running this command.
 * @param config React Native Community CLI configuration object.
 * @param args Parsed command line arguments.
 *
 * @internal
 * @category CLI command
 */
async function bundle(_, cliConfig, args) {
  const webpackConfigPath = (0, _common.getWebpackConfigFilePath)(cliConfig.root, args.webpackConfig);
  const cliOptions = {
    config: {
      root: cliConfig.root,
      platforms: Object.keys(cliConfig.platforms),
      bundlerConfigPath: webpackConfigPath,
      reactNativePath: cliConfig.reactNativePath
    },
    command: 'bundle',
    arguments: {
      bundle: args
    }
  };
  if (!args.entryFile) {
    throw new Error("Option '--entry-file <path>' argument is missing");
  }
  if (args.verbose ?? process.argv.includes('--verbose')) {
    process.env[_env.VERBOSE_ENV_KEY] = '1';
  }
  const envOptions = (0, _common.getEnvOptions)(cliOptions);
  const webpackConfig = await (0, _common.loadConfig)(webpackConfigPath, envOptions);
  const errorHandler = async (error, stats) => {
    if (error) {
      console.error(error);
      process.exit(2);
    }
    if (stats?.hasErrors()) {
      stats.compilation?.errors?.forEach(e => {
        console.error(e);
      });
      process.exit(2);
    }
    if (args.json && stats !== undefined) {
      const statsOptions = (0, _common.normalizeStatsOptions)(compiler.options.stats, args.stats);
      const statsJson = stats.toJson(statsOptions);
      try {
        await (0, _common.writeStats)(statsJson, {
          filepath: args.json,
          rootDir: compiler.context
        });
      } catch (e) {
        console.error(String(e));
        process.exit(2);
      }
    }
  };
  const compiler = (0, _webpack.default)(webpackConfig);
  return new Promise(resolve => {
    if (args.watch) {
      compiler.hooks.watchClose.tap('bundle', resolve);
      compiler.watch(webpackConfig.watchOptions ?? {}, errorHandler);
    } else {
      compiler.run((error, stats) => {
        // make cache work: https://webpack.js.org/api/node/#run
        compiler.close(async closeErr => {
          if (closeErr) console.error(closeErr);
          await errorHandler(error, stats);
          resolve();
        });
      });
    }
  });
}
//# sourceMappingURL=bundle.js.map