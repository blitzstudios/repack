"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RepackInitRuntimeModule = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RepackInitRuntimeModule extends _webpack.default.RuntimeModule {
  constructor(config) {
    super('repack/init', _webpack.default.RuntimeModule.STAGE_BASIC);
    this.config = config;
  }

  generate() {
    return _webpack.default.Template.asString(['// Repack runtime initialization logic', _webpack.default.Template.getFunctionContent(require('./implementation/init')).replaceAll('$hmrEnabled$', `${this.config.hmrEnabled ?? false}`).replaceAll('$chunkId$', `"${this.config.chunkId ?? 'unknown'}"`).replaceAll('$chunkLoadingGlobal$', `"${this.config.chunkLoadingGlobal}"`).replaceAll('$globalObject$', this.config.globalObject)]);
  }

}

exports.RepackInitRuntimeModule = RepackInitRuntimeModule;
//# sourceMappingURL=RepackInitRuntimeModule.js.map