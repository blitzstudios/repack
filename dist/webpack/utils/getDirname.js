"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDirname = getDirname;

var _path = _interopRequireDefault(require("path"));

var _url = require("url");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get absolute directory (without any protocol) from a `file://` URL of a module.
 * Mostly useful in ESM Webpack configs, where `__dirname` is not available, but `import.meta.url` is.
 *
 * @param fileUrl String with absolute `file://` URL of a module.
 * @returns Absolute dirname without `file://` of a module pointed by `fileUrl`.
 *
 * @category Webpack util
 *
 * @example Usage in Webpack config (ESM):
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
  return _path.default.dirname(new _url.URL(fileUrl).pathname);
}
//# sourceMappingURL=getDirname.js.map