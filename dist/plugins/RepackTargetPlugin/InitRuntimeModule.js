"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeInitRuntimeModule = void 0;
// runtime module class is generated dynamically based on the compiler instance
// this way it's compatible with both webpack and rspack
const makeInitRuntimeModule = (compiler, moduleConfig) => {
  const Template = compiler.webpack.Template;
  const RuntimeModule = compiler.webpack.RuntimeModule;
  const InitRuntimeModule = class extends RuntimeModule {
    constructor(config) {
      super('repack/init', RuntimeModule.STAGE_NORMAL);
      this.config = config;
    }
    generate() {
      return Template.asString([Template.getFunctionContent(require('./implementation/init.js')).replaceAll('$globalObject$', this.config.globalObject)]);
    }
  };
  return new InitRuntimeModule(moduleConfig);
};
exports.makeInitRuntimeModule = makeInitRuntimeModule;
//# sourceMappingURL=InitRuntimeModule.js.map