"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RepackTargetPlugin = void 0;

var _path = _interopRequireDefault(require("path"));

var _webpack = _interopRequireDefault(require("webpack"));

var _RepackInitRuntimeModule = require("./runtime/RepackInitRuntimeModule");

var _RepackLoadScriptRuntimeModule = require("./runtime/RepackLoadScriptRuntimeModule");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Plugin for tweaking the JavaScript runtime code to account for React Native environment.
 *
 * Globally available APIs differ with React Native and other target's like Web, so there are some
 * tweaks necessary to make the final bundle runnable inside React Native's JavaScript VM.
 *
 * @category Webpack Plugin
 */
class RepackTargetPlugin {
  /**
   * Constructs new `RepackTargetPlugin`.
   *
   * @param config Plugin configuration options.
   */
  constructor(config) {
    this.config = config;
  }
  /**
   * Apply the plugin.
   *
   * @param compiler Webpack compiler instance.
   */


  apply(compiler) {
    const globalObject = 'self';
    compiler.options.target = false;
    compiler.options.output.chunkLoading = 'jsonp';
    compiler.options.output.chunkFormat = 'array-push';
    compiler.options.output.globalObject = globalObject; // Normalize global object.

    new _webpack.default.BannerPlugin({
      raw: true,
      entryOnly: true,
      banner: _webpack.default.Template.asString([`/******/ var ${globalObject} = ${globalObject} || this || new Function("return this")() || ({}); // repackGlobal'`, '/******/'])
    }).apply(compiler); // Replace React Native's HMRClient.js with custom Webpack-powered DevServerClient.

    new _webpack.default.NormalModuleReplacementPlugin(/react-native([/\\]+)Libraries([/\\]+)Utilities([/\\]+)HMRClient\.js$/, function (resource) {
      const request = require.resolve('../../../modules/DevServerClient');

      const context = _path.default.dirname(request);

      resource.request = request;
      resource.context = context;
      resource.createData.resource = request;
      resource.createData.context = context;
    }).apply(compiler);
    compiler.hooks.compilation.tap('RepackTargetPlugin', compilation => {
      compilation.hooks.additionalTreeRuntimeRequirements.tap('RepackTargetPlugin', (chunk, runtimeRequirements) => {
        var _this$config;

        runtimeRequirements.add(_webpack.default.RuntimeGlobals.startupOnlyAfter); // Add code initialize Re.Pack's runtime logic.

        compilation.addRuntimeModule(chunk, new _RepackInitRuntimeModule.RepackInitRuntimeModule({
          chunkId: chunk.id ?? undefined,
          globalObject,
          chunkLoadingGlobal: compiler.options.output.chunkLoadingGlobal,
          hmrEnabled: compilation.options.mode === 'development' && ((_this$config = this.config) === null || _this$config === void 0 ? void 0 : _this$config.hmr)
        }));
      }); // Overwrite Webpack's default load script runtime code with Re.Pack's implementation
      // specific to React Native.

      compilation.hooks.runtimeRequirementInTree.for(_webpack.default.RuntimeGlobals.loadScript).tap('RepackTargetPlugin', chunk => {
        compilation.addRuntimeModule(chunk, new _RepackLoadScriptRuntimeModule.RepackLoadScriptRuntimeModule(chunk.id ?? undefined)); // Return `true` to make sure Webpack's default load script runtime is not added.

        return true;
      });
    });
  }

}

exports.RepackTargetPlugin = RepackTargetPlugin;
//# sourceMappingURL=RepackTargetPlugin.js.map