"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDevServerOptions = getDevServerOptions;
exports.DEFAULT_PORT = void 0;

var _getFallbackFromOptions = require("./internal/getFallbackFromOptions");

var _parseCliOptions = require("./internal/parseCliOptions");

/** Default development server (proxy) port. */
const DEFAULT_PORT = 8081;
exports.DEFAULT_PORT = DEFAULT_PORT;

function getDevServerOptions(options = {
  fallback: {
    port: DEFAULT_PORT
  }
}) {
  const cliOptions = (0, _parseCliOptions.parseCliOptions)();

  if (!cliOptions) {
    return {
      port: DEFAULT_PORT,
      ...(0, _getFallbackFromOptions.getFallbackFromOptions)(options)
    };
  }

  if ('bundle' in cliOptions.arguments) {
    return {
      port: DEFAULT_PORT,
      enabled: false,
      ...(0, _getFallbackFromOptions.getFallbackFromOptions)(options)
    };
  } else {
    var _getFallbackFromOptio, _ref;

    const {
      host,
      port,
      https,
      cert,
      key
    } = cliOptions.arguments.start;
    return {
      enabled: true,
      hmr: (_getFallbackFromOptio = (0, _getFallbackFromOptions.getFallbackFromOptions)(options).hmr) !== null && _getFallbackFromOptio !== void 0 ? _getFallbackFromOptio : true,
      host: host || (0, _getFallbackFromOptions.getFallbackFromOptions)(options).host,
      port: (_ref = port !== null && port !== void 0 ? port : (0, _getFallbackFromOptions.getFallbackFromOptions)(options).port) !== null && _ref !== void 0 ? _ref : DEFAULT_PORT,
      https,
      cert,
      key
    };
  }
}
//# sourceMappingURL=getDevServerOptions.js.map