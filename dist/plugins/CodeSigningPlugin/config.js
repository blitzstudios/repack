"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionsSchema = void 0;
exports.validateConfig = validateConfig;
var _schemaUtils = require("schema-utils");
/**
 * {@link CodeSigningPlugin} configuration options.
 */

const optionsSchema = exports.optionsSchema = {
  type: 'object',
  properties: {
    enabled: {
      type: 'boolean'
    },
    privateKeyPath: {
      type: 'string'
    },
    excludeChunks: {
      anyOf: [{
        type: 'array',
        items: {
          type: 'string'
        }
      }, {
        type: 'array',
        items: {
          instanceof: 'RegExp'
        }
      }, {
        instanceof: 'RegExp'
      }]
    }
  },
  required: ['privateKeyPath'],
  additionalProperties: false
};
function validateConfig(config) {
  (0, _schemaUtils.validate)(optionsSchema, config, {
    name: 'CodeSigningPlugin'
  });
}
//# sourceMappingURL=config.js.map