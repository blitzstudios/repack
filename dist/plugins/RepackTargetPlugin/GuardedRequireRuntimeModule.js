"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeGuardedRequireRuntimeModule = void 0;
// runtime module class is generated dynamically based on the compiler instance
// this way it's compatible with both webpack and rspack
const makeGuardedRequireRuntimeModule = (compiler, moduleConfig) => {
  const Template = compiler.webpack.Template;
  const RuntimeModule = compiler.webpack.RuntimeModule;
  const GuardedRequireRuntimeModule = class extends RuntimeModule {
    constructor(config) {
      super('repack/guarded require', RuntimeModule.STAGE_NORMAL);
      this.config = config;
    }
    generate() {
      return Template.asString([Template.getFunctionContent(require('./implementation/guardedRequire.js')).replaceAll('$globalObject$', this.config.globalObject)]);
    }
  };
  return new GuardedRequireRuntimeModule(moduleConfig);
};
exports.makeGuardedRequireRuntimeModule = makeGuardedRequireRuntimeModule;
//# sourceMappingURL=GuardedRequireRuntimeModule.js.map