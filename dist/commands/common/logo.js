"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = logo;
var colorette = _interopRequireWildcard(require("colorette"));
var _gradientString = _interopRequireDefault(require("gradient-string"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const logoStr = `
▄▀▀▀ ▀▀▀▀   █▀▀█ █▀▀█ ▄▀▀▀ █  █
█    ▀▀▀▀   █▀▀▀ █▀▀█ █    █▀▀▄
▀    ▀▀▀▀ ▀ ▀    ▀  ▀  ▀▀▀ ▀  ▀`;
function logo(version, bundler) {
  const gradientLogo = (0, _gradientString.default)([{
    color: '#9b6dff',
    pos: 0.45
  }, {
    color: '#3ce4cb',
    pos: 0.9
  }]).multiline(logoStr);
  return `${gradientLogo}\n${version}, powered by ${colorette.bold(bundler)}\n\n`;
}
//# sourceMappingURL=logo.js.map