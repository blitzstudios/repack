"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformBundleToHermesBytecode = void 0;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _execa = _interopRequireDefault(require("execa"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Transforms a bundle to Hermes bytecode.
 *
 * Logic based on implementations for each platform.
 * - iOS: [react-native-xcode.sh](https://github.com/facebook/react-native/blob/f38fc9ba8681622f7cfdb586753e50c596946929/packages/react-native/scripts/react-native-xcode.sh#L166-L187)
 * - Android: [BundleHermesCTask.kt](https://github.com/facebook/react-native/blob/f38fc9ba8681622f7cfdb586753e50c596946929/packages/react-native-gradle-plugin/src/main/kotlin/com/facebook/react/tasks/BundleHermesCTask.kt#L93-L111) (with defaults in [ReactExtension.kt](https://github.com/facebook/react-native/blob/f38fc9ba8681622f7cfdb586753e50c596946929/packages/react-native-gradle-plugin/src/main/kotlin/com/facebook/react/ReactExtension.kt#L116-L117))
 */
const transformBundleToHermesBytecode = async ({
  hermesCLIPath,
  useSourceMaps,
  bundlePath
}) => {
  const hermesBundlePath = bundlePath + '.hbc';
  const hermesSourceMapPath = bundlePath + '.hbc.map';

  try {
    // Transform bundle to bytecode
    await (0, _execa.default)(hermesCLIPath, ['-w', // Silence warnings else buffer overflows
    '-O', // Enable optimizations
    '-emit-binary', '-out', hermesBundlePath, useSourceMaps ? '-output-source-map' : '', bundlePath].filter(Boolean));
    await _fsExtra.default.unlink(bundlePath);
    await _fsExtra.default.rename(hermesBundlePath, bundlePath);
    return {
      sourceMap: hermesSourceMapPath
    };
  } catch (error) {
    const message = error.toString();
    throw new Error(`ChunksToHermesBytecodePlugin: Failed to transform bundle ${bundlePath}. Reason:\n${message})`);
  }
};

exports.transformBundleToHermesBytecode = transformBundleToHermesBytecode;
//# sourceMappingURL=transformBundleToHermesBytecode.js.map