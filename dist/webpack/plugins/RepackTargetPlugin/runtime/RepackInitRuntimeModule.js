"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RepackInitRuntimeModule = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RepackInitRuntimeModule extends _webpack.default.RuntimeModule {
  constructor(chunkId, globalObject, chunkLoadingGlobal) {
    super('repack/init', _webpack.default.RuntimeModule.STAGE_BASIC);
    this.chunkId = chunkId;
    this.globalObject = globalObject;
    this.chunkLoadingGlobal = chunkLoadingGlobal;
  }

  generate() {
    return _webpack.default.Template.asString(['// Repack runtime initialization logic', _webpack.default.Template.getFunctionContent(require('./implementation/init')).replaceAll('$chunkId$', `"${this.chunkId ?? 'unknown'}"`).replaceAll('$chunkLoadingGlobal$', `"${this.chunkLoadingGlobal}"`).replaceAll('$globalObject$', this.globalObject)]);
  }

}

exports.RepackInitRuntimeModule = RepackInitRuntimeModule;
//# sourceMappingURL=RepackInitRuntimeModule.js.map