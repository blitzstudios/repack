"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RepackLoadScriptRuntimeModule = void 0;
var _webpack = _interopRequireDefault(require("webpack"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class RepackLoadScriptRuntimeModule extends _webpack.default.RuntimeModule {
  constructor(chunkId) {
    super('repack/load script', _webpack.default.RuntimeModule.STAGE_BASIC);
    this.chunkId = chunkId;
  }
  generate() {
    return _webpack.default.Template.asString(['// A bridge between Webpack runtime and Repack runtime for loading chunks and HMR updates', _webpack.default.Template.getFunctionContent(require('./implementation/loadScript')).replaceAll('$loadScript$', _webpack.default.RuntimeGlobals.loadScript).replaceAll('$caller$', `'${this.chunkId?.toString()}'`)]);
  }
}
exports.RepackLoadScriptRuntimeModule = RepackLoadScriptRuntimeModule;
//# sourceMappingURL=RepackLoadScriptRuntimeModule.js.map