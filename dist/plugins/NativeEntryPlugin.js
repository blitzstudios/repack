"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NativeEntryPlugin = void 0;
var _nodePath = _interopRequireDefault(require("node:path"));
var _isRspackCompiler = require("./utils/isRspackCompiler.js");
var _moveElementBefore = require("./utils/moveElementBefore.js");
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
    const initializeScriptManagerPath = require.resolve('../modules/InitializeScriptManager.js');
    const nativeEntries = [...getReactNativePolyfills(), initializeCorePath, initializeScriptManagerPath];
    compiler.hooks.entryOption.tap({
      name: 'RepackNativeEntryPlugin',
      before: 'RepackDevelopmentPlugin'
    }, (_, entry) => {
      if (typeof entry === 'function') {
        throw new Error('[RepackNativeEntryPlugin] Dynamic entry (function) is not supported.');
      }
      Object.keys(entry).forEach(entryName => {
        // runtime property defines the chunk name, otherwise it defaults to the entry key
        const entryChunkName = entry[entryName].runtime || entryName;

        // add native entries to all declared entry points
        for (const nativeEntry of nativeEntries) {
          new compiler.webpack.EntryPlugin(compiler.context, nativeEntry, {
            name: entryChunkName // prepends the entry to the chunk of specified name
          }).apply(compiler);
        }
      });
    });
    if (!(0, _isRspackCompiler.isRspackCompiler)(compiler)) {
      // In Webpack, Module Federation Container entry gets injected during the compilation's make phase,
      // similar to how dynamic entries work. This means the federation entry is added after our native entries.
      // We need to reorder dependencies to ensure federation entry is placed before native entries.
      compiler.hooks.make.tap({
        name: 'RepackNativeEntryPlugin',
        stage: 1000
      }, compilation => {
        for (const entry of compilation.entries.values()) {
          (0, _moveElementBefore.moveElementBefore)(entry.dependencies, {
            elementToMove: /\.federation\/entry/,
            beforeElement: nativeEntries[0],
            getElement: dependency => dependency.request ?? ''
          });
        }
      });
    }
  }
}
exports.NativeEntryPlugin = NativeEntryPlugin;
//# sourceMappingURL=NativeEntryPlugin.js.map