"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodeSigningPlugin = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CodeSigningPlugin {
  /**
   * Constructs new `RepackPlugin`.
   *
   * @param config Plugin configuration options.
   */
  constructor(config) {
    this.config = config;
    this.config.privateKeyPath = this.config.privateKeyPath ?? './private.pem';
  }
  /**
   * Apply the plugin.
   *
   * @param compiler Webpack compiler instance.
   */


  apply(compiler) {
    /**
     * For now this flag defaults to true to avoid a breaking change.
     *
     * TODO: In next major revision, we should consider removing the default here
     * and align this option with other plugins.
     */
    if (this.config.enabled === false) {
      return;
    }

    const pluginName = CodeSigningPlugin.name; // reserve 1280 bytes for the token even if it's smaller
    // to leave some space for future additions to the JWT without breaking compatibility

    const TOKEN_BUFFER_SIZE = 1280; // used to denote beginning of the code-signing section of the bundle
    // alias for "Repack Code-Signing Signature Begin"

    const BEGIN_CS_MARK = '/* RCSSB */';

    const privateKeyPath = _path.default.join(compiler.context, this.config.privateKeyPath);

    const privateKey = _fsExtra.default.readFileSync(privateKeyPath);

    const chunkFiles = new Set(); // Tapping to the "thisCompilation" hook in order to further tap
    // to the compilation process on an later stage.

    compiler.hooks.thisCompilation.tap(pluginName, compilation => {
      // we need to make sure that assets are fully processed in order
      // to create a code-signing mapping.
      compilation.hooks.afterProcessAssets.tap(pluginName, () => {
        // adjust for chunk name to filename
        compilation.chunks.forEach(chunk => {
          chunk.files.forEach(file => {
            var _this$config$excludeC;

            // Exclude main output bundle because it's always local
            if (file === compilation.outputOptions.filename) {
              return;
            } // Exclude chunks specified in config


            if ((_this$config$excludeC = this.config.excludeChunks) !== null && _this$config$excludeC !== void 0 && _this$config$excludeC.includes(String(chunk.id))) {
              return;
            }

            chunkFiles.add(file);
          });
        });
      });
      compiler.hooks.afterEmit.tapPromise(pluginName, async compilation => {
        await Promise.all(Array.from(chunkFiles).map(async chunk => {
          const bundle = await _fsExtra.default.readFile(_path.default.join(compilation.outputOptions.path, chunk)); // generate bundle hash

          const hash = _crypto.default.createHash('sha256').update(bundle).digest('hex'); // generate token


          const token = _jsonwebtoken.default.sign({
            hash
          }, privateKey, {
            algorithm: 'RS256'
          }); // combine the bundle and the token


          const signedBundle = Buffer.concat([bundle, Buffer.from(BEGIN_CS_MARK), Buffer.from(token)], bundle.length + TOKEN_BUFFER_SIZE);
          await _fsExtra.default.ensureDir(this.config.outputPath);
          await _fsExtra.default.writeFile(_path.default.join(compiler.context, this.config.outputPath, chunk), signedBundle);
        }));
      });
    });
  }

}

exports.CodeSigningPlugin = CodeSigningPlugin;
//# sourceMappingURL=CodeSigningPlugin.js.map