"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BabelPlugin = void 0;
/**
 * Plugin that adds babel-loader fallback to resolveLoader configuration.
 * This ensures babel-loader can be resolved regardless of the package manager used,
 * as some package managers (like pnpm) require loaders to be direct dependencies
 * rather than allowing them to be resolved through nested dependencies.
 *
 * @category Webpack Plugin
 */
class BabelPlugin {
  apply(compiler) {
    compiler.options.resolveLoader = {
      ...compiler.options.resolveLoader,
      fallback: {
        ...compiler.options.resolveLoader?.fallback,
        'babel-loader': require.resolve('babel-loader')
      }
    };
  }
}
exports.BabelPlugin = BabelPlugin;
//# sourceMappingURL=BabelPlugin.js.map