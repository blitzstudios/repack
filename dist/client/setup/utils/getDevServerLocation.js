"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDevServerLocation = getDevServerLocation;

var _getDevServer = _interopRequireDefault(require("react-native/Libraries/Core/Devtools/getDevServer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore
let location;

function getDevServerLocation() {
  if (!location) {
    const {
      url
    } = (0, _getDevServer.default)();
    const origin = url.replace(/\/$/, '');
    const host = origin.replace(/https?:\/\//, '');
    location = {
      host,
      hostname: host.split(':')[0],
      href: url,
      origin,
      pathname: url.split(host)[1],
      port: host.split(':')[1],
      protocol: (url.match(/^([a-z])+:\/\//) || [undefined, undefined])[1]
    };
  }

  return location;
}
//# sourceMappingURL=getDevServerLocation.js.map