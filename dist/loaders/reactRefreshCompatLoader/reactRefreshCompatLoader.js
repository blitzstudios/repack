"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reactRefreshCompatLoader;
exports.raw = void 0;
var _dedent = _interopRequireDefault(require("dedent"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const reactRefreshFooter = (0, _dedent.default)(`
  function $RefreshSig$() {
    return $ReactRefreshRuntime$.createSignatureFunctionForTransform();
  }

  function $RefreshReg$(type, id) {
    $ReactRefreshRuntime$.register(type, __webpack_module__.id + "_" + id);
  }

  Promise.resolve().then(function() {
    $ReactRefreshRuntime$.refresh(__webpack_module__.id, __webpack_module__.hot);
  });
`);
const raw = exports.raw = false;

/**
 * This loader is used in Webpack configuration as a fallback loader for 'builtin:react-refresh-loader' from Rspack.
 * Thanks to this loader, which mimics the one written in Rust, we can utilize "@rspack/plugin-react-refresh" in Webpack as well,
 * instead of relying on "@pmmmwh/react-refresh-webpack-plugin".
 *
 * Reference implementation: https://github.com/web-infra-dev/rspack/blob/main/crates/rspack_loader_react_refresh/src/lib.rs
 */
function reactRefreshCompatLoader(originalSource, sourceMap, meta) {
  const callback = this.async();
  const source = `${originalSource}\n\n${reactRefreshFooter}`;
  callback(null, source, sourceMap, meta);
}
//# sourceMappingURL=reactRefreshCompatLoader.js.map