"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NativeEntryPlugin = void 0;
var _nodePath = _interopRequireDefault(require("node:path"));
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
    const entries = getReactNativePolyfills().concat(initializeCorePath);

    // Add React-Native entries
    for (const entry of entries) {
      new compiler.webpack.EntryPlugin(compiler.context, entry, {
        name: undefined
      }).apply(compiler);
    }

    // Initialize ScriptManager
    new compiler.webpack.EntryPlugin(compiler.context, require.resolve('../modules/InitializeScriptManager'), {
      name: undefined
    }).apply(compiler);
  }
}
exports.NativeEntryPlugin = NativeEntryPlugin;
//# sourceMappingURL=NativeEntryPlugin.js.map