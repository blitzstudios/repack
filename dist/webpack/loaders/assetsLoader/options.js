"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOptions = getOptions;
exports.optionsSchema = void 0;

var _webpack = require("webpack");

var _loaderUtils = _interopRequireDefault(require("loader-utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const optionsSchema = {
  type: 'object',
  required: ['platform', 'scalableAssetExtensions'],
  properties: {
    platform: {
      type: 'string'
    },
    scalableAssetExtensions: {
      type: 'array'
    },
    inline: {
      type: 'boolean'
    },
    devServerEnabled: {
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
        publicPath: {
          type: 'string',
          pattern: '^https?://'
        }
      }
    }
  }
};
exports.optionsSchema = optionsSchema;

function getOptions(loaderContext) {
  const options = _loaderUtils.default.getOptions(loaderContext) || {};
  (0, _webpack.validateSchema)(optionsSchema, options, {
    name: 'repackAssetsLoader'
  });
  return options;
}
//# sourceMappingURL=options.js.map