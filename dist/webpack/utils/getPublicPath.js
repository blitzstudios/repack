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
 *
 * @example Usage in Webpack config:
 * ```ts
 * import * as Repack from '@callstack/repack';
 *
 * export default (env) => {
 *   const {
 *     platform,
 *     devServer = undefined,
 *   } = env;
 *
 *   return {
 *     output: {
 *       publicPath: Repack.getPublicPath({ platform, devServer }),
 *     },
 *   };
 * };
 * ```
 */
function getPublicPath(options) {
  if (options !== null && options !== void 0 && options.devServer) {
    const {
      port,
      host,
      https
    } = options.devServer;
    return `${https ? 'https' : 'http'}://${host || 'localhost'}:${port}/${options.platform}/`;
  } else {
    return `noop:///`;
  }
}
//# sourceMappingURL=getPublicPath.js.map