"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodeSigningPlugin = void 0;
var _nodeCrypto = _interopRequireDefault(require("node:crypto"));
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _nodeUtil = _interopRequireDefault(require("node:util"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _config = require("./config");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class CodeSigningPlugin {
  /**
   * Constructs new `RepackPlugin`.
   *
   * @param config Plugin configuration options.
   */
  constructor(config) {
    this.config = config;
    (0, _config.validateConfig)(config);
    this.config.excludeChunks = this.config.excludeChunks ?? [];
    this.chunkFilenames = new Set();
  }
  shouldSignFile(file, mainOutputFilename, excludedChunks) {
    /** Exclude non-chunks & main chunk as it's always local */
    if (!this.chunkFilenames.has(file) || file === mainOutputFilename) {
      return false;
    }
    return !excludedChunks.some(chunk => {
      if (chunk instanceof RegExp) {
        return chunk.test(file);
      }
      return chunk === file;
    });
  }

  /**
   * Apply the plugin.
   *
   * @param compiler Webpack compiler instance.
   */
  apply(compiler) {
    const pluginName = CodeSigningPlugin.name;
    const logger = compiler.getInfrastructureLogger(pluginName);
    if (this.config.enabled === false) {
      return;
    }
    if (typeof compiler.options.output.filename === 'function') {
      throw new Error('CodeSigningPlugin does not support dynamic output filename. Please use static filename instead.');
    }
    /**
     * Reserve 1280 bytes for the token even if it's smaller
     * to leave some space for future additions to the JWT without breaking compatibility
     */
    const TOKEN_BUFFER_SIZE = 1280;
    /**
     * Used to denote beginning of the code-signing section of the bundle
     * alias for "Repack Code-Signing Signature Begin"
     */
    const BEGIN_CS_MARK = '/* RCSSB */';
    const privateKeyPath = _nodePath.default.isAbsolute(this.config.privateKeyPath) ? this.config.privateKeyPath : _nodePath.default.resolve(compiler.context, this.config.privateKeyPath);
    const privateKey = _nodeFs.default.readFileSync(privateKeyPath);
    const excludedChunks = Array.isArray(this.config.excludeChunks) ? this.config.excludeChunks : [this.config.excludeChunks];
    compiler.hooks.emit.tap(pluginName, compilation => {
      compilation.chunks.forEach(chunk => {
        chunk.files.forEach(file => this.chunkFilenames.add(file));
      });
    });
    compiler.hooks.assetEmitted.tapPromise({
      name: pluginName,
      stage: 20
    }, async (file, {
      outputPath,
      content,
      compilation
    }) => {
      const mainBundleName = compilation.outputOptions.filename;
      if (!this.shouldSignFile(file, mainBundleName, excludedChunks)) {
        return;
      }
      logger.debug(`Signing ${file}`);
      /** generate bundle hash */
      const hash = _nodeCrypto.default.createHash('sha256').update(content).digest('hex');
      /** generate token */
      const token = _jsonwebtoken.default.sign({
        hash
      }, privateKey, {
        algorithm: 'RS256'
      });
      /** combine the bundle and the token */
      const signedBundle = Buffer.concat([content, Buffer.from(BEGIN_CS_MARK), Buffer.from(token)], content.length + TOKEN_BUFFER_SIZE);
      const writeFileAsync = _nodeUtil.default.promisify(compiler.outputFileSystem.writeFile);
      await writeFileAsync(_nodePath.default.join(outputPath, file), signedBundle);
      logger.debug(`Signed ${file}`);
    });
  }
}
exports.CodeSigningPlugin = CodeSigningPlugin;
//# sourceMappingURL=CodeSigningPlugin.js.map