"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOptions = getOptions;
exports.optionsSchema = void 0;
var _schemaUtils = require("schema-utils");
const optionsSchema = exports.optionsSchema = {
  type: 'object',
  required: [],
  properties: {
    all: {
      type: 'boolean'
    },
    ignoreUninitializedFields: {
      type: 'boolean'
    },
    pretty: {
      type: 'boolean'
    },
    removeEmptyImports: {
      type: 'boolean'
    }
  }
};
function getOptions(loaderContext) {
  const options = loaderContext.getOptions(loaderContext) || {};
  (0, _schemaUtils.validate)(optionsSchema, options, {
    name: 'repackFlowLoader'
  });
  return options;
}
//# sourceMappingURL=options.js.map