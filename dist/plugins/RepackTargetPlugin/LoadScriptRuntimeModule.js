"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeLoadScriptRuntimeModule = void 0;
// runtime module class is generated dynamically based on the compiler instance
// this way it's compatible with both webpack and rspack
const makeLoadScriptRuntimeModule = (compiler, moduleConfig) => {
  const Template = compiler.webpack.Template;
  const RuntimeGlobals = compiler.webpack.RuntimeGlobals;
  const RuntimeModule = compiler.webpack.RuntimeModule;
  const LoadScriptRuntimeModule = class extends RuntimeModule {
    constructor(config) {
      super('repack/load script', RuntimeModule.STAGE_BASIC);
      this.config = config;
    }
    generate() {
      return Template.asString([Template.getFunctionContent(require('./implementation/loadScript.js')).replaceAll('$caller$', `'${this.config.chunkId?.toString()}'`).replaceAll('$hmrEnabled$', `${this.config.hmrEnabled}`).replaceAll('$loadScript$', RuntimeGlobals.loadScript)]);
    }
  };
  return new LoadScriptRuntimeModule(moduleConfig);
};
exports.makeLoadScriptRuntimeModule = makeLoadScriptRuntimeModule;
//# sourceMappingURL=LoadScriptRuntimeModule.js.map