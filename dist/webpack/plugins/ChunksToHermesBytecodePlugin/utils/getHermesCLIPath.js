"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHermesCLIPath = void 0;

var _path = _interopRequireDefault(require("path"));

var _os = _interopRequireDefault(require("os"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Folder name of the Hermes compiler binary for the current OS.
 */
const getHermesOSBin = () => {
  switch (_os.default.platform()) {
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
    throw new Error('ChunksToHermesBytecodePlugin: OS not recognized. Please set hermesCLIPath to the path of a working Hermes compiler.');
  }

  return _path.default.join(reactNativePath, 'sdks', 'hermesc', osBin, 'hermesc');
};

exports.getHermesCLIPath = getHermesCLIPath;
//# sourceMappingURL=getHermesCLIPath.js.map