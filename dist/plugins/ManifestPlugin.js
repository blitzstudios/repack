"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManifestPlugin = void 0;
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
    compiler.hooks.compilation.tap('ManifestPlugin', compilation => {
      compilation.hooks.afterProcessAssets.tap('ManifestPlugin', () => {
        for (const chunk of compilation.chunks) {
          const manifest = {
            id: chunk.id,
            name: chunk.name,
            files: [...chunk.files].sort(),
            auxiliaryFiles: [...chunk.auxiliaryFiles].sort()
          };
          if (manifest.files.length) {
            const manifestFilename = `${manifest.files[0]}.json`;
            compilation.emitAsset(manifestFilename, new compiler.webpack.sources.RawSource(JSON.stringify(manifest)));
          }
        }
      });
    });
  }
}
exports.ManifestPlugin = ManifestPlugin;
//# sourceMappingURL=ManifestPlugin.js.map