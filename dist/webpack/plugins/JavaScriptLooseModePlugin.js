"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JavaScriptLooseModePlugin = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Enable JavaScript loose mode, by removing `use strict` directives from the code.
 * This plugin should only be used for compatibility reasons with Metro, where some libraries
 * might not work in JavaScript Strict mode.
 *
 * @category Webpack Plugin
 */
class JavaScriptLooseModePlugin {
  /**
   * Constructs new `JavaScriptLooseModePlugin`.
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
    const shouldUseLooseMode = filename => _webpack.default.ModuleFilenameHelpers.matchObject(this.config, filename);

    compiler.hooks.make.tap('JavaScriptLooseModePlugin', compilation => {
      compilation.moduleTemplates.javascript.hooks.render.tap('JavaScriptLooseModePlugin', (moduleSource, {
        resource
      }) => {
        if (!shouldUseLooseMode(resource)) {
          return moduleSource;
        }

        const source = moduleSource.source().toString();
        const match = source.match(/['"]use strict['"]/);

        if (!match || match.index === undefined) {
          return moduleSource;
        }

        const replacement = new _webpack.default.sources.ReplaceSource(moduleSource);
        replacement.replace(match.index, match.index + match[0].length, '');
        return replacement;
      });
    });
  }

}

exports.JavaScriptLooseModePlugin = JavaScriptLooseModePlugin;
//# sourceMappingURL=JavaScriptLooseModePlugin.js.map