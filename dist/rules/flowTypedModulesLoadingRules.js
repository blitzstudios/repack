"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FLOW_TYPED_MODULES_LOADING_RULES = void 0;
var _utils = require("../utils");
/**
 * @constant FLOW_TYPED_MODULES_LOADING_RULES
 * @type {RuleSetRule}
 * @description Module rule configuration for loading flow-typed modules.
 */
const FLOW_TYPED_MODULES_LOADING_RULES = exports.FLOW_TYPED_MODULES_LOADING_RULES = {
  type: 'javascript/auto',
  test: /\.jsx?$/,
  include: (0, _utils.getModulePaths)(['react-native-blob-util', 'react-native-pdf', '@react-native-picker/picker', 'react-native-config', 'react-native-fs', 'react-native-image-size', 'react-native-performance', 'react-native-vector-icons', '@react-native-community/datetimepicker', 'react-native-linear-gradient']),
  use: {
    loader: '@callstack/repack/flow-loader',
    options: {
      all: true
    }
  }
};
//# sourceMappingURL=flowTypedModulesLoadingRules.js.map