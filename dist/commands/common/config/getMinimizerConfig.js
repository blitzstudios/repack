"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMinimizerConfig = getMinimizerConfig;
var _semver = _interopRequireDefault(require("semver"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// prefer `terser-webpack-plugin` installed in the project root to the one shipped with Re.Pack
async function getTerserPlugin(rootDir) {
  let terserPluginPath;
  try {
    terserPluginPath = require.resolve('terser-webpack-plugin', {
      paths: [rootDir]
    });
  } catch {
    terserPluginPath = require.resolve('terser-webpack-plugin');
  }
  const plugin = await import(terserPluginPath);
  return 'default' in plugin ? plugin.default : plugin;
}
async function getTerserConfig(rootDir) {
  const TerserPlugin = await getTerserPlugin(rootDir);
  return new TerserPlugin({
    test: /\.(js)?bundle(\?.*)?$/i,
    extractComments: false,
    terserOptions: {
      format: {
        comments: false
      }
    }
  });
}

// use SwcJsMinimizerRspackPlugin for Rspack 1.4.11
// Rspack 1.5.0 broke the minimizer again, pending a fix
function shouldUseTerserForRspack(rspackVersion) {
  const version = _semver.default.coerce(rspackVersion) ?? '0.0.0';
  return !_semver.default.eq(version, '1.4.11');
}
async function getWebpackMinimizer(rootDir) {
  return [await getTerserConfig(rootDir)];
}
async function getRspackMinimizer(rootDir) {
  const rspack = await import('@rspack/core');
  return [shouldUseTerserForRspack(rspack.rspackVersion) ? await getTerserConfig(rootDir) : new rspack.SwcJsMinimizerRspackPlugin({
    test: /\.(js)?bundle(\?.*)?$/i,
    extractComments: false,
    minimizerOptions: {
      format: {
        comments: false
      }
    }
  })];
}
async function getMinimizerConfig(bundler, rootDir) {
  return bundler === 'rspack' ? getRspackMinimizer(rootDir) : getWebpackMinimizer(rootDir);
}