"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManifestPlugin = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @category Webpack Plugin
 */
class ManifestPlugin {
  /**
   * Apply the plugin.
   *
   * @param compiler Webpack compiler instance.
   */
  apply(compiler) {
    compiler.hooks.compilation.tap('TargetPlugin', compilation => {
      compilation.hooks.afterProcessAssets.tap('TargetPlugin', () => {
        for (const chunk of compilation.chunks) {
          const manifest = {
            id: chunk.id,
            name: chunk.name,
            files: [...chunk.files].sort(),
            auxiliaryFiles: [...chunk.auxiliaryFiles].sort()
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

exports.ManifestPlugin = ManifestPlugin;
//# sourceMappingURL=ManifestPlugin.js.map