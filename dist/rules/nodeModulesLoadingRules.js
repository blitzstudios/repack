"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NODE_MODULES_LOADING_RULES = void 0;
var _utils = require("../utils");
/**
 * @constant NODE_MODULES_LOADING_RULES
 * @type {RuleSetRule}
 * @description Module rule configuration for loading node_modules, excluding React Native Core & out-of-tree platform packages.
 */
const NODE_MODULES_LOADING_RULES = exports.NODE_MODULES_LOADING_RULES = {
  type: 'javascript/auto',
  test: /\.[cm]?[jt]sx?$/,
  include: [/node_modules/],
  exclude: (0, _utils.getModulePaths)(['react', 'react-native', '@react-native', 'react-native-macos', 'react-native-windows', 'react-native-tvos', '@callstack/react-native-visionos']),
  rules: [{
    test: /jsx?$/,
    use: [{
      loader: 'builtin:swc-loader',
      options: {
        env: {
          targets: {
            'react-native': '0.74'
          }
        },
        jsc: {
          loose: true,
          parser: {
            syntax: 'ecmascript',
            jsx: true
          },
          externalHelpers: true
        },
        module: {
          type: 'commonjs',
          strict: false,
          strictMode: false
        }
      }
    }]
  }, {
    test: /tsx?$/,
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
            syntax: 'typescript',
            tsx: true
          },
          loose: true,
          externalHelpers: true
        },
        module: {
          type: 'commonjs',
          strict: false,
          strictMode: false
        }
      }
    }]
  }]
};
//# sourceMappingURL=nodeModulesLoadingRules.js.map