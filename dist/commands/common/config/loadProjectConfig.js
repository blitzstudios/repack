"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadProjectConfig = loadProjectConfig;
var _nodeUrl = _interopRequireDefault(require("node:url"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
async function loadProjectConfig(configFilePath) {
  let config;
  try {
    const {
      href: fileUrl
    } = _nodeUrl.default.pathToFileURL(configFilePath);
    config = await import(fileUrl);
  } catch {
    config = require(configFilePath);
  }
  if ('default' in config) {
    config = config.default;
  }
  return config;
}
//# sourceMappingURL=loadProjectConfig.js.map