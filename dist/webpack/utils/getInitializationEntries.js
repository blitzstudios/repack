"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInitializationEntries = getInitializationEntries;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get setup and initialization entires for Webpack configuration's `entry` field.
 * The returned entires should be added before your project entry.
 *
 * @param reactNativePath Absolute path to directory with React Native dependency.
 * @param options Additional options that can modify returned entires.
 * @returns Array of entires.
 *
 * @category Webpack util
 */
function getInitializationEntries(reactNativePath, options = {}) {
  const {
    initializeCoreLocation,
    hmr
  } = options;

  const getPolyfills = require(_path.default.join(reactNativePath, 'rn-get-polyfills.js'));

  const entries = [...getPolyfills(), initializeCoreLocation || _path.default.join(reactNativePath, 'Libraries/Core/InitializeCore.js'), require.resolve('../../client/setup/setupRepack')];

  if (hmr) {
    entries.push(require.resolve('../../client/setup/modules/WebpackHMRClient'));
  }

  return entries;
}
//# sourceMappingURL=getInitializationEntries.js.map