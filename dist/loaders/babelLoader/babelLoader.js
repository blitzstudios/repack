"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = babelLoader;
exports.transform = exports.raw = void 0;
var _core = require("@babel/core");
var _utils = require("./utils.js");
const raw = exports.raw = false;
function buildBabelConfig(babelOptions, {
  includePlugins,
  excludePlugins
}) {
  const config = {
    babelrc: true,
    highlightCode: true,
    comments: true,
    plugins: [],
    sourceType: 'unambiguous',
    ...babelOptions,
    // output settings
    ast: false,
    code: true,
    cloneInputAst: false,
    // disable optimization through babel
    compact: false,
    minified: false
  };
  if (includePlugins) {
    config.plugins.push(...includePlugins);
  }
  const babelConfig = (0, _core.loadOptions)(config);
  if (!babelConfig) {
    throw new Error('Failed to load babel config');
  }
  if (excludePlugins && babelConfig.plugins) {
    const excludedPlugins = new Set(excludePlugins);
    babelConfig.plugins = babelConfig.plugins.filter(plugin => !(excludedPlugins.has(plugin.key) || plugin.key === 'warn-on-deep-imports' && (0, _utils.isIgnoredRepackDeepImport)(babelOptions.filename)));
  }
  return babelConfig;
}
const transform = async (src, transformOptions, customOptions) => {
  const babelConfig = buildBabelConfig(transformOptions, {
    includePlugins: customOptions?.includePlugins,
    excludePlugins: customOptions?.excludePlugins
  });
  const projectRoot = babelConfig.root ?? babelConfig.cwd;
  // load hermes parser dynamically to match the version from preset
  const hermesParser = await (0, _utils.loadHermesParser)(projectRoot, customOptions?.hermesParserPath);

  // filename will be always defined at this point
  const sourceAst = (0, _utils.isTypeScriptSource)(babelConfig.filename) || (0, _utils.isTSXSource)(babelConfig.filename) ? (0, _core.parseSync)(src, babelConfig) : hermesParser.parse(src, {
    babel: true,
    reactRuntimeTarget: '19',
    sourceType: babelConfig.sourceType,
    ...customOptions?.hermesParserOverrides
  });
  if (!sourceAst) {
    throw new Error(`Failed to parse source file: ${babelConfig.filename}`);
  }
  const result = (0, _core.transformFromAstSync)(sourceAst, src, babelConfig);
  if (!result) {
    throw new Error(`Failed to transform source file: ${babelConfig.filename}`);
  }
  const sourceType = sourceAst.program.sourceType;
  return {
    ...result,
    sourceType
  };
};
exports.transform = transform;
async function babelLoader(source, sourceMap) {
  this.cacheable();
  const callback = this.async();
  const options = this.getOptions();
  const {
    hermesParserPath,
    hermesParserOverrides,
    ...babelOverrides
  } = options;
  const inputSourceMap = sourceMap ? JSON.parse(sourceMap) : undefined;
  const withSourceMaps = this.resourcePath.match(/node_modules/) ? false : this.sourceMap;
  try {
    const result = await transform(source, {
      caller: {
        name: '@callstack/repack'
      },
      filename: this.resourcePath,
      sourceMaps: withSourceMaps,
      sourceFileName: this.resourcePath,
      sourceRoot: this.context,
      inputSourceMap: withSourceMaps ? inputSourceMap : undefined,
      ...babelOverrides
    }, {
      hermesParserPath,
      hermesParserOverrides
    });
    callback(null, result.code ?? undefined, result.map ?? undefined);
  } catch (e) {
    callback(e);
  }
}