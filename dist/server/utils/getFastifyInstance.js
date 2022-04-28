"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFastifyInstance = getFastifyInstance;

var _fastify = _interopRequireDefault(require("fastify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFastifyInstance(config, logger) {
  if (config.https && config.cert && config.key) {
    // @ts-ignore
    return (0, _fastify.default)({
      logger,
      https: {
        cert: config.cert,
        key: config.key
      }
    });
  } else {
    // @ts-ignore
    return (0, _fastify.default)({
      logger
    });
  }
}
//# sourceMappingURL=getFastifyInstance.js.map