"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommandConfig = getCommandConfig;
var _consts = require("../../consts.js");
function getStartCommandDefaults() {
  return {
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
function getCommandConfig(command) {
  if (command === 'start') {
    return getStartCommandDefaults();
  }
  if (command === 'bundle') {
    return getBundleCommandDefaults();
  }
  throw new Error(`Unknown command: ${command}`);
}
//# sourceMappingURL=getCommandConfig.js.map