"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeCompilerConfig = makeCompilerConfig;
var _webpackMerge = require("webpack-merge");
var _getCliOverrides = require("./getCliOverrides.js");
var _getCommandConfig = require("./getCommandConfig.js");
var _getConfigFilePath = require("./getConfigFilePath.js");
var _getEnvOptions = require("./getEnvOptions.js");
var _getRepackConfig = require("./getRepackConfig.js");
var _loadProjectConfig = require("./loadProjectConfig.js");
var _normalizeConfig = require("./normalizeConfig.js");
var _validatePlugins = require("./validatePlugins.js");
async function makeCompilerConfig(options) {
  const {
    args,
    bundler,
    command,
    rootDir,
    reactNativePath
  } = options;
  // discover location of project config
  const configPath = (0, _getConfigFilePath.getConfigFilePath)(bundler, rootDir, args.config ?? args.webpackConfig);

  // get env options for backwards compatibility with 4.X configs
  // injected as first argument to config functions
  const env = (0, _getEnvOptions.getEnvOptions)({
    args,
    command,
    rootDir,
    reactNativePath
  });

  // get cli overrides which take precedence over values from config files
  const cliConfigOverrides = (0, _getCliOverrides.getCliOverrides)({
    args,
    command
  });
  // get defaults for use with specific commands
  const commandConfig = (0, _getCommandConfig.getCommandConfig)(command, bundler);

  // get defaults that will be applied on top of built-in ones (Rspack/webpack)
  const repackConfig = await (0, _getRepackConfig.getRepackConfig)(bundler, rootDir);

  // load the project config
  const rawConfig = await (0, _loadProjectConfig.loadProjectConfig)(configPath);

  // inject env and create platform-specific configs
  const projectConfigs = await Promise.all(options.platforms.map(platform => {
    // eval the config and inject the platform
    if (typeof rawConfig === 'function') {
      return rawConfig({
        ...env,
        platform
      }, {});
    }
    // shallow copy to avoid mutating the original config
    return {
      ...rawConfig
    };
  }));

  // merge in reverse order to create final configs
  const configs = projectConfigs.map(config => (0, _webpackMerge.merge)([repackConfig, commandConfig, config, cliConfigOverrides]));

  // normalize the configs
  const normalizedConfigs = configs.map((config, index) => (0, _normalizeConfig.normalizeConfig)(config, options.platforms[index]));
  const plugins = normalizedConfigs.flatMap(config => 'plugins' in config ? config.plugins : []);
  await (0, _validatePlugins.validatePlugins)(rootDir, plugins, options.bundler);
  return normalizedConfigs;
}