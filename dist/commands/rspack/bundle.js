"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bundle = bundle;
var _core = require("@rspack/core");
var _env = require("../../env");
var _common = require("../common");
/**
 * Bundle command for React Native Community CLI.
 * It runs Rspack, builds bundle and saves it alongside any other assets and Source Map
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
  const rspackConfigPath = (0, _common.getRspackConfigFilePath)(cliConfig.root, args.config ?? args.webpackConfig);
  const cliOptions = {
    config: {
      root: cliConfig.root,
      platforms: Object.keys(cliConfig.platforms),
      bundlerConfigPath: rspackConfigPath,
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
  if (args.verbose) {
    process.env[_env.VERBOSE_ENV_KEY] = '1';
  }
  const envOptions = (0, _common.getEnvOptions)(cliOptions);
  const config = await (0, _common.loadConfig)(rspackConfigPath, envOptions);
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
  const compiler = (0, _core.rspack)(config);
  return new Promise(resolve => {
    if (args.watch) {
      compiler.hooks.watchClose.tap('bundle', resolve);
      compiler.watch(config.watchOptions ?? {}, errorHandler);
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