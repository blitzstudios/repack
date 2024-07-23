"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDirname = getDirname;
var _path = _interopRequireDefault(require("path"));
var _url = require("url");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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
  return _path.default.dirname((0, _url.fileURLToPath)(fileUrl));
}
//# sourceMappingURL=getDirname.js.map