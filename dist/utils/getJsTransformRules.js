"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJsTransformRules = getJsTransformRules;
var _getCodegenTransformRules = require("./getCodegenTransformRules.js");
var _getFlowTransformRules = require("./getFlowTransformRules.js");
var _getSwcLoaderOptions = require("./getSwcLoaderOptions.js");
/**
 * Interface for {@link getJsTransformRules} options.
 */

/**
 * Generates Rspack `module.rules` configuration for transforming JavaScript, TypeScript, and Flow files.
 * It combines SWC loader configuration for JS/TS files with Flow and codegen transformations.
 * You can consider it an equivalent of `@react-native/babel-preset`, but for SWC.
 *
 * @param options Configuration options for JavaScript/TypeScript transformations
 * @param options.swc Configuration options for SWC transformations
 * @param options.flow Configuration for enabling/disabling Flow transformations
 * @param options.codegen Configuration for enabling/disabling codegen transformations
 *
 * @returns Array of Rspack module rules for transforming JavaScript, TypeScript and Flow files
 */
function getJsTransformRules(options) {
  const jsRules = (0, _getSwcLoaderOptions.getSwcLoaderOptions)({
    syntax: 'js',
    jsx: true,
    ...options?.swc
  });
  const tsRules = (0, _getSwcLoaderOptions.getSwcLoaderOptions)({
    syntax: 'ts',
    jsx: true,
    ...options?.swc
  });
  const tsxRules = (0, _getSwcLoaderOptions.getSwcLoaderOptions)({
    syntax: 'ts',
    jsx: true,
    ...options?.swc
  });
  const flowRules = options?.flow?.enabled !== false ? (0, _getFlowTransformRules.getFlowTransformRules)(options?.flow) : [];
  const codegenRules = options?.codegen?.enabled !== false ? (0, _getCodegenTransformRules.getCodegenTransformRules)() : [];
  return [{
    type: 'javascript/auto',
    test: /\.([cm]?[jt]sx?|flow)$/,
    oneOf: [{
      test: /jsx?$/,
      include: /node_modules/,
      use: {
        loader: 'builtin:swc-loader',
        options: {
          ...jsRules,
          sourceMaps: false
        }
      }
    }, {
      test: /jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'builtin:swc-loader',
        options: {
          ...jsRules,
          sourceMaps: true
        }
      }
    }, {
      test: /ts$/,
      include: /node_modules/,
      use: {
        loader: 'builtin:swc-loader',
        options: {
          ...tsRules,
          sourceMaps: false
        }
      }
    }, {
      test: /ts$/,
      exclude: /node_modules/,
      use: {
        loader: 'builtin:swc-loader',
        options: {
          ...tsRules,
          sourceMaps: true
        }
      }
    }, {
      test: /tsx$/,
      include: /node_modules/,
      use: {
        loader: 'builtin:swc-loader',
        options: {
          ...tsxRules,
          sourceMaps: false
        }
      }
    }, {
      test: /tsx$/,
      exclude: /node_modules/,
      use: {
        loader: 'builtin:swc-loader',
        options: {
          ...tsxRules,
          sourceMaps: true
        }
      }
    }]
  }, ...flowRules, ...codegenRules];
}