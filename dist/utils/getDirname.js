"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDirname = getDirname;
var _nodePath = _interopRequireDefault(require("node:path"));
var _nodeUrl = require("node:url");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Converts a `file:///` URL to an absolute directory path.
 * Useful in ESM Webpack configs where `__dirname` is unavailable.
 *
 * @param fileUrl The `file:///` URL of a module.
 * @returns The directory path without the `file:///` prefix.
 *
 * @category Webpack util
 *
 * @example Usage in a Webpack ESM config:
 * ```ts
 * import * as Repack from '@callstack/repack';
 *
 * export default (env) => {
 *   const {
 *     context = Repack.getDirname(import.meta.url)
 *   } = env;
 * };
 * ```
 */
function getDirname(fileUrl) {
  return _nodePath.default.dirname((0, _nodeUrl.fileURLToPath)(fileUrl));
}
//# sourceMappingURL=getDirname.js.map