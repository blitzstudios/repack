"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NativeEntryPlugin = void 0;
var _nodePath = _interopRequireDefault(require("node:path"));
var _isRspackCompiler = require("./utils/isRspackCompiler");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class NativeEntryPlugin {
  constructor(config) {
    this.config = config;
  }
  getReactNativePath(candidate) {
    let reactNativePath;
    if (typeof candidate === 'string') {
      reactNativePath = candidate;
    }
    if (typeof candidate === 'object') {
      const candidates = candidate.filter(Boolean);
      reactNativePath = candidates[0];
    }
    if (!reactNativePath) {
      reactNativePath = require.resolve('react-native');
    }
    return _nodePath.default.extname(reactNativePath) ? _nodePath.default.dirname(reactNativePath) : reactNativePath;
  }
  apply(compiler) {
    const reactNativePath = this.getReactNativePath(compiler.options.resolve.alias?.['react-native']);
    const getReactNativePolyfills = require(_nodePath.default.join(reactNativePath, 'rn-get-polyfills.js'));
    const initializeCorePath = this.config?.initializeCoreLocation ?? _nodePath.default.join(reactNativePath, 'Libraries/Core/InitializeCore.js');
    const initializeScriptManagerPath = require.resolve('../modules/InitializeScriptManager');
    const entries = [...getReactNativePolyfills(), initializeCorePath, initializeScriptManagerPath];

    // Initialization of MF entry requires setImmediate to be defined
    // but in React Native it happens during InitializeCore so we need
    // to shim it here to prevent ReferenceError
    // TBD if this has any sort of impact
    new compiler.webpack.EntryPlugin(compiler.context, 'data:text/javascript,globalThis.setImmediate = globalThis.setImmediate || function(){ /* noop */ };', {
      name: undefined
    }).apply(compiler);

    // TODO (jbroma): refactor this to be more maintainable
    // This is a very hacky way to reorder entrypoints, and needs to be done differently
    // depending on the compiler type (rspack/webpack)
    if ((0, _isRspackCompiler.isRspackCompiler)(compiler)) {
      // Add entries after the rspack MF entry is added during `hook.afterPlugins` stage
      compiler.hooks.initialize.tap({
        name: 'NativeEntryPlugin',
        stage: 100
      }, () => {
        for (const entry of entries) {
          new compiler.webpack.EntryPlugin(compiler.context, entry, {
            name: undefined
          }).apply(compiler);
        }
      });
    } else {
      const prependEntries = entryConfig => {
        if (!(this.config.entryName in entryConfig)) {
          throw new Error(`Entry '${this.config.entryName}' does not exist in the entry configuration`);
        }
        entryConfig[this.config.entryName].import = [...entries, ...(entryConfig[this.config.entryName].import ?? [])];
        return entryConfig;
      };
      if (typeof compiler.options.entry === 'function') {
        const dynamicEntry = compiler.options.entry;
        compiler.options.entry = () => dynamicEntry().then(prependEntries);
      } else {
        compiler.options.entry = prependEntries(compiler.options.entry);
      }
    }
  }
}
exports.NativeEntryPlugin = NativeEntryPlugin;
//# sourceMappingURL=NativeEntryPlugin.js.map