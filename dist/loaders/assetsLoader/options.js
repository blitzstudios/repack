"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOptions = getOptions;
exports.optionsSchema = void 0;
var _schemaUtils = require("schema-utils");
// Note: publicPath could be obtained from webpack config in the future

const optionsSchema = exports.optionsSchema = {
  type: 'object',
  properties: {
    platform: {
      type: 'string'
    },
    scalableAssetExtensions: {
      type: 'array'
    },
    scalableAssetResolutions: {
      type: 'array'
    },
    inline: {
      type: 'boolean'
    },
    publicPath: {
      type: 'string'
    },
    remote: {
      type: 'object',
      required: ['enabled', 'publicPath'],
      properties: {
        enabled: {
          type: 'boolean'
        },
        assetPath: {
          instanceOf: 'Function'
        },
        publicPath: {
          type: 'string',
          pattern: '^https?://'
        }
      }
    }
  }
};
function getOptions(loaderContext) {
  const options = loaderContext.getOptions() || {};
  (0, _schemaUtils.validate)(optionsSchema, options, {
    name: 'repackAssetsLoader'
  });
  return options;
}
//# sourceMappingURL=options.js.map