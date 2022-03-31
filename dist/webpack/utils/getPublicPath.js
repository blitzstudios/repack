"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPublicPath = getPublicPath;

/** {@link getPublicPath} options. */

/**
 * Get Webpack's public path.
 *
 * @param options Options object.
 * @returns Value for Webpack's `output.publicPath` option.
 *
 * @category Webpack util
 */
function getPublicPath(options) {
  const {
    port,
    host = 'localhost',
    https,
    enabled
  } = options;

  if (enabled) {
    return `${https ? 'https' : 'http'}://${host}:${port}/`;
  } else {
    return `noop:///`;
  }
}
//# sourceMappingURL=getPublicPath.js.map