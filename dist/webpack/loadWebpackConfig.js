"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadWebpackConfig = loadWebpackConfig;

async function loadWebpackConfig(webpackConfigPath, env) {
  let config;

  try {
    config = require(webpackConfigPath);
  } catch {
    config = await import(webpackConfigPath);
  }

  if ('default' in config) {
    config = config.default;
  }

  if (typeof config === 'function') {
    return await config(env, {});
  }

  return config;
}
//# sourceMappingURL=loadWebpackConfig.js.map