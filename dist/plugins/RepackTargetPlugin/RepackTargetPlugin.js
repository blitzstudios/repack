"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RepackTargetPlugin = void 0;
var _nodePath = _interopRequireDefault(require("node:path"));
var _GuardedRequireRuntimeModule = require("./GuardedRequireRuntimeModule.js");
var _InitRuntimeModule = require("./InitRuntimeModule.js");
var _LoadScriptRuntimeModule = require("./LoadScriptRuntimeModule.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Plugin for tweaking the JavaScript runtime code to account for React Native environment.
 *
 * Globally available APIs differ with React Native and other target's like Web, so there are some
 * tweaks necessary to make the final bundle runnable inside React Native's JavaScript VM.
 *
 * @category Webpack Plugin
 */
class RepackTargetPlugin {
  replaceRuntimeModule(module, content) {
    // webpack
    if ('getGeneratedCode' in module) {
      module.getGeneratedCode = () => content;
      return;
    }

    // rspack
    if (module.source !== undefined) {
      module.source.source = Buffer.from(content, 'utf-8');
    } else {
      // should never happen
      throw new Error('Module source is not available');
    }
  }
  apply(__compiler) {
    const compiler = __compiler;
    const globalObject = 'self';
    compiler.options.target = false;
    compiler.options.output.chunkLoading = 'jsonp';
    compiler.options.output.chunkFormat = 'array-push';
    compiler.options.output.globalObject = globalObject;

    // Normalize global object.
    new compiler.webpack.BannerPlugin({
      raw: true,
      entryOnly: true,
      banner: compiler.webpack.Template.asString([`/******/ var ${globalObject} = ${globalObject} || this || new Function("return this")() || ({}); // repackGlobal'`, '/******/'])
    }).apply(compiler);

    // Replace React Native's HMRClient.js with custom Webpack-powered DevServerClient.
    new compiler.webpack.NormalModuleReplacementPlugin(/react-native.*?([/\\]+)Libraries([/\\]+)Utilities([/\\]+)HMRClient\.js$/, resource => {
      const request = require.resolve('../../modules/DevServerClient.js');
      const context = _nodePath.default.dirname(request);
      resource.request = request;
      resource.context = context;
      // @ts-expect-error incomplete rspack types
      resource.createData.resource = request;
      // @ts-expect-error incomplete rspack types
      resource.createData.context = context;
    }).apply(compiler);

    // ReactNativePrivateInitializeCore.js is an unnecessary module exisiting in order to make metro happy
    // it reexports InitializeCore which is included as one of the initial modules running before main entrypoint
    // making this module noop makes inlining entry modules possible which might improve startup time
    new compiler.webpack.NormalModuleReplacementPlugin(/react-native.*?([/\\]+)Libraries[/\\]ReactPrivate[/\\]ReactNativePrivateInitializeCore\.js$/, require.resolve('../../modules/EmptyModule.js')).apply(compiler);

    // ReactNativeTypes.js is flow type only module
    new compiler.webpack.NormalModuleReplacementPlugin(/react-native.*?([/\\]+)Libraries[/\\]Renderer[/\\]shims[/\\]ReactNativeTypes\.js$/, require.resolve('../../modules/EmptyModule.js')).apply(compiler);
    compiler.hooks.compilation.tap('RepackTargetPlugin', compilation => {
      compilation.hooks.additionalTreeRuntimeRequirements.tap('RepackTargetPlugin', chunk => {
        compilation.addRuntimeModule(chunk, (0, _GuardedRequireRuntimeModule.makeGuardedRequireRuntimeModule)(compiler, {
          globalObject
        }));
        compilation.addRuntimeModule(chunk, (0, _InitRuntimeModule.makeInitRuntimeModule)(compiler, {
          globalObject
        }));
      });
    });
    compiler.hooks.thisCompilation.tap('RepackTargetPlugin', compilation => {
      compilation.hooks.runtimeModule.tap('RepackTargetPlugin', (module, chunk) => {
        if (module.name === 'load_script' || module.name === 'load script') {
          const loadScriptRuntimeModule = (0, _LoadScriptRuntimeModule.makeLoadScriptRuntimeModule)(compiler, {
            chunkId: chunk.id ?? undefined,
            hmrEnabled: !!compiler.options.devServer?.hot
          });

          // inject runtime module
          this.replaceRuntimeModule(module, loadScriptRuntimeModule.generate());
        }

        // Remove CSS runtime modules
        if (module.name === 'css_loading' || module.name === 'get css chunk filename') {
          this.replaceRuntimeModule(module, '// noop');
        }
      });
    });
  }
}
exports.RepackTargetPlugin = RepackTargetPlugin;