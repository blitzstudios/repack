"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChunksToHermesBytecodePlugin = void 0;
var _HermesBytecodePlugin = require("./HermesBytecodePlugin.js");
/**
 * @deprecated Use `HermesBytecodePlugin` instead.
 *
 * ChunksToHermesBytecodePlugin was renamed to HermesBytecodePlugin.
 * This is a deprecated alias that will be removed in the next major version.
 */
class ChunksToHermesBytecodePlugin extends _HermesBytecodePlugin.HermesBytecodePlugin {
  // biome-ignore lint/complexity/noUselessConstructor: needed for jsdocs
  constructor(config) {
    super(config);
  }
  apply(compiler) {
    const logger = compiler.getInfrastructureLogger('RepackChunksToHermesBytecodePlugin');
    compiler.hooks.beforeCompile.tap('RepackChunksToHermesBytecodePlugin', () => {
      logger.warn('Notice: ChunksToHermesBytecodePlugin has been renamed ' + 'and is now available as HermesBytecodePlugin. ' + 'Please use HermesBytecodePlugin instead as this alias ' + 'is deprecated and will be removed in the next major version.');
    });
    super.apply(compiler);
  }
}
exports.ChunksToHermesBytecodePlugin = ChunksToHermesBytecodePlugin;
//# sourceMappingURL=ChunksToHermesBytecodePlugin.js.map