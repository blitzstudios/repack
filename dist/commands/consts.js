"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEV_SERVER_ASSET_TYPES = exports.DEFAULT_WEBPACK_CONFIG_LOCATIONS = exports.DEFAULT_RSPACK_CONFIG_LOCATIONS = exports.DEFAULT_PORT = exports.DEFAULT_HOSTNAME = void 0;
/** Default development server hostname. */
const DEFAULT_HOSTNAME = exports.DEFAULT_HOSTNAME = 'localhost';

/** Default development server port. */
const DEFAULT_PORT = exports.DEFAULT_PORT = +process.env.RCT_METRO_PORT || 8081;

/** Default webpack config locations. */
const DEFAULT_WEBPACK_CONFIG_LOCATIONS = exports.DEFAULT_WEBPACK_CONFIG_LOCATIONS = ['webpack.config.mjs', 'webpack.config.cjs', 'webpack.config.js', '.webpack/webpack.config.mjs', '.webpack/webpack.config.cjs', '.webpack/webpack.config.js', '.webpack/webpackfile'];

/** Default rspack config locations. */
const DEFAULT_RSPACK_CONFIG_LOCATIONS = exports.DEFAULT_RSPACK_CONFIG_LOCATIONS = ['rspack.config.mjs', 'rspack.config.cjs', 'rspack.config.js'];

/**
 * Dev Server supported asset types.
 *
 * These are the types of assets that will be served from the compiler output
 * instead of the local filesystem.
 */
const DEV_SERVER_ASSET_TYPES = exports.DEV_SERVER_ASSET_TYPES = new RegExp(['\\.bundle$', '\\.map$', '\\.hot-update\\.js(on)?$', '^assets', '^remote-assets'].join('|'));
//# sourceMappingURL=consts.js.map