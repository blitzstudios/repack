"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bundle = bundle;
var _core = require("@rspack/core");
var _index = require("../../helpers/index.js");
var _makeCompilerConfig = require("../common/config/makeCompilerConfig.js");
var _index2 = require("../common/index.js");
/**
 * Bundle command that builds and saves the bundle
 * alongside any other assets to filesystem using Webpack.
 *
 * @param _ Original, non-parsed arguments that were provided when running this command.
 * @param cliConfig Configuration object containing platform and project settings.
 * @param args Parsed command line arguments.
 */
async function bundle(_, cliConfig, args) {
  const [config] = await (0, _makeCompilerConfig.makeCompilerConfig)({
    args: args,
    bundler: 'rspack',
    command: 'bundle',
    rootDir: cliConfig.root,
    platforms: [args.platform],
    reactNativePath: cliConfig.reactNativePath
  });

  // remove devServer configuration to avoid schema validation errors
  delete config.devServer;

  // expose selected args as environment variables
  (0, _index2.setupEnvironment)(args);
  const maxWorkers = args.maxWorkers ?? (0, _index2.getMaxWorkers)();
  (0, _index2.setupRspackEnvironment)(maxWorkers.toString());
  if (!args.entryFile && !config.entry) {
    throw new _index.CLIError("Option '--entry-file <path>' argument is missing");
  }
  if (args.resetCache) {
    (0, _index2.resetPersistentCache)({
      bundler: 'rspack',
      rootDir: cliConfig.root,
      cacheConfigs: [config.experiments?.cache]
    });
  }
  const errorHandler = async (error, stats) => {
    if (error) {
      throw new _index.CLIError(error.message);
    }
    if (stats?.hasErrors()) {
      stats.compilation?.errors?.forEach(e => {
        console.error(e);
      });
      process.exit(2);
    }
    if (args.json && stats !== undefined) {
      const statsOptions = (0, _index2.normalizeStatsOptions)(compiler.options.stats, args.stats);
      const statsJson = stats.toJson(statsOptions);
      try {
        await (0, _index2.writeStats)(statsJson, {
          filepath: args.json,
          rootDir: compiler.context
        });
      } catch (e) {
        throw new _index.CLIError(String(e));
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