"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadConfig = loadConfig;
async function loadConfig(configFilePath, env) {
  let config;
  try {
    config = require(configFilePath);
  } catch {
    config = await import(configFilePath);
  }
  if ('default' in config) {
    config = config.default;
  }
  if (typeof config === 'function') {
    return await config(env, {});
  }
  return config;
}
//# sourceMappingURL=loadConfig.js.map