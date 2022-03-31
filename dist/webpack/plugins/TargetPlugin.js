"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TargetPlugin = void 0;

var _path = _interopRequireDefault(require("path"));

var _webpack = _interopRequireDefault(require("webpack"));

var _getRepackBootstrap = require("../../client/setup/inline/getRepackBootstrap");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Plugin for tweaking the JavaScript runtime code to account for React Native environment.
 *
 * Globally available APIs differ with React Native and other target's like Web, so there are some
 * tweaks necessary to make the final bundle runnable inside React Native's JavaScript VM.
 *
 * @category Webpack Plugin
 */
class TargetPlugin {
  /**
   * Apply the plugin.
   *
   * @param compiler Webpack compiler instance.
   */
  apply(compiler) {
    compiler.options.target = false;
    compiler.options.output.chunkLoading = 'jsonp';
    compiler.options.output.chunkFormat = 'array-push';
    compiler.options.output.globalObject = 'self';
    new _webpack.default.NormalModuleReplacementPlugin(/react-native([/\\]+)Libraries([/\\]+)Utilities([/\\]+)HMRClient\.js$/, function (resource) {
      const request = require.resolve('../../client/setup/modules/DevServerClient');

      const context = _path.default.dirname(request);

      resource.request = request;
      resource.context = context;
      resource.createData.resource = request;
      resource.createData.context = context;
    }).apply(compiler); // Overwrite `LoadScriptRuntimeModule.generate` to avoid shipping DOM specific
    // code in the bundle. `__webpack_require__.l` implementation is provided
    // in `../../../runtime/setupChunkLoader.ts`.

    _webpack.default.runtime.LoadScriptRuntimeModule.prototype.generate = function () {
      return _webpack.default.Template.asString([`${_webpack.default.RuntimeGlobals.loadScript} = function(u, c, n, i) {`, _webpack.default.Template.indent(`return __repack__.loadChunk.call(this, u, c, n, i, "${this.chunk.id}");`), '};']);
    };

    const renderBootstrap = _webpack.default.javascript.JavascriptModulesPlugin.prototype.renderBootstrap;

    _webpack.default.javascript.JavascriptModulesPlugin.prototype.renderBootstrap = function (...args) {
      const result = renderBootstrap.call(this, ...args);
      result.afterStartup.push('');
      result.afterStartup.push('// Re.Pack after startup');
      result.afterStartup.push(`__repack__.loadChunkCallback.push("${args[0].chunk.id}")`);
      return result;
    };

    compiler.hooks.environment.tap('TargetPlugin', () => {
      new _webpack.default.BannerPlugin({
        raw: true,
        entryOnly: true,
        banner: (0, _getRepackBootstrap.getRepackBootstrap)({
          chunkLoadingGlobal: compiler.options.output.chunkLoadingGlobal
        })
      }).apply(compiler);
    });
    compiler.hooks.compilation.tap('TargetPlugin', compilation => {
      compilation.hooks.afterProcessAssets.tap('TargetPlugin', () => {
        for (const chunk of compilation.chunks) {
          const manifest = {
            id: chunk.id,
            name: chunk.name,
            files: [...chunk.files],
            auxiliaryFiles: [...chunk.auxiliaryFiles]
          };

          if (manifest.files.length) {
            const manifestFile = `${manifest.files[0]}.json`;
            chunk.auxiliaryFiles.add(manifestFile);
            compilation.emitAsset(manifestFile, new _webpack.default.sources.RawSource(JSON.stringify(manifest)));
          }
        }
      });
    });
  }

}

exports.TargetPlugin = TargetPlugin;
//# sourceMappingURL=TargetPlugin.js.map