"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SourceMapPlugin = void 0;
var _nodePath = _interopRequireDefault(require("node:path"));
var _index = require("../helpers/index.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function devToolsmoduleFilenameTemplate(namespace, info) {
  // inlined modules
  if (!info.identifier) {
    return `${namespace}`;
  }
  const [prefix, ...parts] = info.resourcePath.split('/');

  // prefixed modules like React DevTools Backend
  if (prefix !== '.' && prefix !== '..') {
    const resourcePath = parts.filter(part => part !== '..').join('/');
    return `webpack://${prefix}/${resourcePath}`;
  }
  const hasValidAbsolutePath = _nodePath.default.isAbsolute(info.absoluteResourcePath);

  // project root
  if (hasValidAbsolutePath && info.resourcePath.startsWith('./')) {
    return `[projectRoot]${info.resourcePath.slice(1)}`;
  }

  // outside of project root
  if (hasValidAbsolutePath && info.resourcePath.startsWith('../')) {
    const parts = info.resourcePath.split('/');
    const upLevel = parts.filter(part => part === '..').length;
    const restPath = parts.slice(parts.lastIndexOf('..') + 1).join('/');
    const rootRef = `[projectRoot^${upLevel}]`;
    return `${rootRef}${restPath ? '/' + restPath : ''}`;
  }
  return `[unknownOrigin]/${_nodePath.default.basename(info.identifier)}`;
}
function defaultModuleFilenameTemplateHandler(_, info) {
  if (!info.absoluteResourcePath.startsWith('/')) {
    // handle inlined modules
    if (info.query || info.loaders || info.allLoaders) {
      return `inlined-${info.hash}`;
    }
  }
  // use absolute path for all other modules
  return info.absoluteResourcePath;
}
class SourceMapPlugin {
  constructor(config = {}) {
    this.config = config;
  }
  apply(__compiler) {
    const compiler = __compiler;

    // if devtool is explicitly set to false, skip generating source maps
    if (!compiler.options.devtool) {
      return;
    }
    let moduleFilenameTemplateHandler;
    if (compiler.options.devServer) {
      const host = compiler.options.devServer.host;
      const port = compiler.options.devServer.port;
      const namespace = `http://${host}:${port}`;
      moduleFilenameTemplateHandler = info => devToolsmoduleFilenameTemplate(namespace, info);
    } else {
      moduleFilenameTemplateHandler = info => defaultModuleFilenameTemplateHandler('', info);
    }
    const format = compiler.options.devtool;
    // disable builtin sourcemap generation
    compiler.options.devtool = false;
    const platform = this.config.platform ?? compiler.options.name;

    // explicitly fallback to uniqueName if devtoolNamespace is not set
    const devtoolNamespace = compiler.options.output.devtoolNamespace ?? compiler.options.output.uniqueName;
    // const devtoolModuleFilenameTemplate =
    //   compiler.options.output.devtoolModuleFilenameTemplate;
    const devtoolFallbackModuleFilenameTemplate = compiler.options.output.devtoolFallbackModuleFilenameTemplate;
    if (format.startsWith('eval')) {
      throw new _index.ConfigurationError('[RepackSourceMapPlugin] Eval source maps are not supported. ' + 'Please use a different setting for `config.devtool`.');
    }
    if (format.startsWith('inline')) {
      throw new _index.ConfigurationError('[RepackSourceMapPlugin] Inline source maps are not supported. ' + 'Please use a different setting for `config.devtool`.');
    }
    const hidden = format.includes('hidden');
    const cheap = format.includes('cheap');
    const moduleMaps = format.includes('module');
    const noSources = format.includes('nosources');
    new compiler.webpack.SourceMapDevToolPlugin({
      test: /\.([cm]?jsx?|bundle)$/,
      filename: '[file].map',
      moduleFilenameTemplate: moduleFilenameTemplateHandler,
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