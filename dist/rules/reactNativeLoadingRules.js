"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REACT_NATIVE_LOADING_RULES = void 0;
var _utils = require("../utils");
var _lazyImports = require("./lazyImports");
/**
 * @constant REACT_NATIVE_LOADING_RULES
 * @type {RuleSetRule}
 * @description Module rule configuration for loading React Native Core & out-of-tree platform packages.
 */
const REACT_NATIVE_LOADING_RULES = exports.REACT_NATIVE_LOADING_RULES = {
  type: 'javascript/dynamic',
  test: /\.jsx?$/,
  include: (0, _utils.getModulePaths)(['react-native', '@react-native', 'react-native-macos', 'react-native-windows', 'react-native-tvos', '@callstack/react-native-visionos']),
  use: [{
    loader: 'builtin:swc-loader',
    options: {
      env: {
        targets: {
          'react-native': '0.74'
        }
      },
      jsc: {
        parser: {
          syntax: 'ecmascript',
          jsx: true,
          exportDefaultFrom: true
        },
        loose: true,
        externalHelpers: true
      },
      module: {
        type: 'commonjs',
        strict: false,
        strictMode: false,
        lazy: _lazyImports.REACT_NATIVE_LAZY_IMPORTS
      }
    }
  }, {
    loader: '@callstack/repack/flow-loader',
    options: {
      all: true
    }
  }]
};
//# sourceMappingURL=reactNativeLoadingRules.js.map