"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMimeType = getMimeType;
var _mimeTypes = _interopRequireDefault(require("mime-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Get the MIME type for a given filename.
 *
 * Note: The `mime-types` library currently uses 'application/javascript' for JavaScript files,
 * but 'text/javascript' is more widely recognized and standard.
 *
 * @param {string} filename - The name of the file to get the MIME type for.
 * @returns {string} - The MIME type of the file.
 */
function getMimeType(filename) {
  if (filename.endsWith('.bundle')) {
    return 'application/javascript';
  }
  if (filename.endsWith('.map')) {
    return 'application/json';
  }
  return _mimeTypes.default.lookup(filename) || 'text/plain';
}