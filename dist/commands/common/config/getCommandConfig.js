"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommandConfig = getCommandConfig;
var _env = require("../../../env.js");
var _consts = require("../../consts.js");
function isExperimentalCacheEnabled() {
  return process.env[_env.EXPERIMENTAL_CACHE_ENV_KEY] === 'true' || process.env[_env.EXPERIMENTAL_CACHE_ENV_KEY] === '1';
}
function getCacheConfig(bundler) {
  if (isExperimentalCacheEnabled()) {
    if (bundler === 'rspack') {
      return {
        cache: true,
        experiments: {
          cache: {
            type: 'persistent'
          }
        }
      };
    }
    return {
      cache: {
        type: 'filesystem'
      }
    };
  }
  return {};
}
function getStartCommandDefaults(bundler) {
  return {
    ...getCacheConfig(bundler),
    mode: 'development',
    devServer: {
      host: _consts.DEFAULT_HOSTNAME,
      port: _consts.DEFAULT_PORT,
      hot: true,
      server: 'http'
    },
    output: {
      publicPath: 'DEV_SERVER_PUBLIC_PATH'
    }
  };
}
function getBundleCommandDefaults() {
  return {
    mode: 'production',
    devServer: false,
    optimization: {
      minimize: true
    }
  };
}
function getCommandConfig(command, bundler) {
  if (command === 'start') {
    return getStartCommandDefaults(bundler);
  }
  if (command === 'bundle') {
    return getBundleCommandDefaults();
  }
  throw new Error(`Unknown command: ${command}`);
}