"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateConfig = validateConfig;
var _schemaUtils = require("schema-utils");
const ruleSchema = {
  anyOf: [{
    type: 'string'
  }, {
    instanceof: 'RegExp'
  }, {
    type: 'array',
    items: {
      anyOf: [{
        type: 'string'
      }, {
        instanceof: 'RegExp'
      }]
    }
  }]
};
const configSchema = {
  type: 'object',
  properties: {
    context: {
      type: 'string'
    },
    platform: {
      type: 'string'
    },
    enabled: {
      type: 'boolean'
    },
    entryName: {
      type: 'string'
    },
    output: {
      type: 'object',
      properties: {
        bundleFilename: {
          type: 'string'
        },
        sourceMapFilename: {
          type: 'string'
        },
        assetsPath: {
          type: 'string'
        },
        auxiliaryAssetsPath: {
          type: 'string'
        }
      },
      additionalProperties: false
    },
    extraChunks: {
      type: 'array',
      items: {
        anyOf: [{
          type: 'object',
          properties: {
            test: ruleSchema,
            include: ruleSchema,
            exclude: ruleSchema,
            type: {
              const: 'remote'
            },
            outputPath: {
              type: 'string'
            }
          },
          required: ['type', 'outputPath'],
          additionalProperties: false
        }, {
          type: 'object',
          properties: {
            test: ruleSchema,
            include: ruleSchema,
            exclude: ruleSchema,
            type: {
              const: 'local'
            }
          },
          required: ['type'],
          additionalProperties: false
        }]
      }
    }
  },
  required: ['context', 'platform', 'output'],
  additionalProperties: false
};
function validateConfig(config) {
  (0, _schemaUtils.validate)(configSchema, config, {
    name: 'OutputPlugin'
  });
}
//# sourceMappingURL=config.js.map