"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRspackCompiler = isRspackCompiler;
/**
 * Check if the compiler is Rspack.
 * Reference: https://github.com/web-infra-dev/rspack/discussions/2640
 *
 * @param compiler Compiler instance to check.
 * @returns `true` if the compiler is Rspack, `false` otherwise.
 */
function isRspackCompiler(compiler) {
  return 'rspackVersion' in compiler.webpack;
}
//# sourceMappingURL=isRspackCompiler.js.map