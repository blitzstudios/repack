"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SourceMapPlugin = void 0;
var _ConfigurationError = require("./utils/ConfigurationError.js");
class SourceMapPlugin {
  constructor(config = {}) {
    this.config = config;
  }
  apply(compiler) {
    // if devtool is explicitly set to false, skip generating source maps
    if (!compiler.options.devtool) {
      return;
    }
    const format = compiler.options.devtool;
    // disable builtin sourcemap generation
    compiler.options.devtool = false;
    const platform = this.config.platform ?? compiler.options.name;

    // explicitly fallback to uniqueName if devtoolNamespace is not set
    const devtoolNamespace = compiler.options.output.devtoolNamespace ?? compiler.options.output.uniqueName;
    const devtoolModuleFilenameTemplate = compiler.options.output.devtoolModuleFilenameTemplate;
    const devtoolFallbackModuleFilenameTemplate = compiler.options.output.devtoolFallbackModuleFilenameTemplate;
    if (format.startsWith('eval')) {
      throw new _ConfigurationError.ConfigurationError('[RepackSourceMapPlugin] Eval source maps are not supported. ' + 'Please use a different setting for `config.devtool`.');
    }
    if (format.startsWith('inline')) {
      throw new _ConfigurationError.ConfigurationError('[RepackSourceMapPlugin] Inline source maps are not supported. ' + 'Please use a different setting for `config.devtool`.');
    }
    const hidden = format.includes('hidden');
    const cheap = format.includes('cheap');
    const moduleMaps = format.includes('module');
    const noSources = format.includes('nosources');

    // TODO Fix sourcemap directory structure
    // Right now its very messy and not every node module is inside of the node module
    // like React Devtools backend etc or some symilinked module appear with relative path
    // We should normalize this through a custom handler and provide an output similar to Metro
    new compiler.webpack.SourceMapDevToolPlugin({
      test: /\.([cm]?jsx?|bundle)$/,
      filename: '[file].map',
      moduleFilenameTemplate: devtoolModuleFilenameTemplate,
      fallbackModuleFilenameTemplate: devtoolFallbackModuleFilenameTemplate,
      append: hidden ? false : `//# sourceMappingURL=[url]?platform=${platform}`,
      module: moduleMaps ? true : !cheap,
      columns: !cheap,
      noSources,
      namespace: devtoolNamespace
    }).apply(compiler);
  }
}
exports.SourceMapPlugin = SourceMapPlugin;
//# sourceMappingURL=SourceMapPlugin.js.map