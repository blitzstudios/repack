"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHermesCLIPath = void 0;
var _nodeOs = _interopRequireDefault(require("node:os"));
var _nodePath = _interopRequireDefault(require("node:path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Folder name of the Hermes compiler binary for the current OS.
 */
const getHermesOSBin = () => {
  switch (_nodeOs.default.platform()) {
    case 'darwin':
      return 'osx-bin';
    case 'linux':
      return 'linux64-bin';
    case 'win32':
      return 'win64-bin';
    default:
      return null;
  }
};

/**
 * Determines the path to the Hermes compiler binary.
 *
 * Defaults to './node_modules/react-native/sdks/hermesc/{os-bin}/hermesc'
 */
const getHermesCLIPath = reactNativePath => {
  const osBin = getHermesOSBin();
  if (!osBin) {
    throw new Error('[RepackHermesBytecodePlugin] OS not recognized. ' + 'Please set hermesCLIPath to the path of a working Hermes compiler.');
  }
  return _nodePath.default.join(reactNativePath, 'sdks', 'hermesc', osBin, 'hermesc');
};
exports.getHermesCLIPath = getHermesCLIPath;
//# sourceMappingURL=getHermesCLIPath.js.map