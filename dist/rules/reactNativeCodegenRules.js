"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REACT_NATIVE_CODEGEN_RULES = void 0;
/**
 * @constant REACT_NATIVE_CODEGEN_RULES
 * @type {RuleSetRule}
 * @description Module rule configuration for handling React Native codegen files.
 */
const REACT_NATIVE_CODEGEN_RULES = exports.REACT_NATIVE_CODEGEN_RULES = {
  test: /(?:^|[\\/])(?:Native\w+|(\w+)NativeComponent)\.[jt]sx?$/,
  rules: [{
    test: /\.tsx?$/,
    use: [{
      loader: 'babel-loader',
      options: {
        babelrc: false,
        configFile: false,
        plugins: ['@babel/plugin-syntax-typescript', '@react-native/babel-plugin-codegen']
      }
    }]
  }, {
    test: /\.jsx?$/,
    use: [{
      loader: 'babel-loader',
      options: {
        babelrc: false,
        configFile: false,
        plugins: ['babel-plugin-syntax-hermes-parser', '@react-native/babel-plugin-codegen']
      }
    }]
  }],
  type: 'javascript/auto'
};
//# sourceMappingURL=reactNativeCodegenRules.js.map