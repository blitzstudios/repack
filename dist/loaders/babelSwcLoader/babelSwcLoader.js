"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = babelSwcLoader;
exports.partitionTransforms = partitionTransforms;
exports.raw = void 0;
var _babelLoader = require("../babelLoader/babelLoader.js");
var _swc = require("./swc.js");
var _utils = require("./utils.js");
const raw = exports.raw = false;
function partitionTransforms(filename, babelTransforms) {
  let normalTransforms = [];
  let configurableTransforms = [];
  let customTransforms = [];
  let swcConfig = {
    jsc: {
      parser: (0, _utils.getSwcParserConfig)(filename),
      transform: {
        react: {
          useBuiltins: true
        }
      }
    }
  };
  normalTransforms = (0, _swc.getSupportedSwcNormalTransforms)(babelTransforms);
  ({
    swcConfig,
    transformNames: configurableTransforms
  } = (0, _swc.getSupportedSwcConfigurableTransforms)(babelTransforms, swcConfig));
  ({
    swcConfig,
    transformNames: customTransforms
  } = (0, _swc.getSupportedSwcCustomTransforms)(babelTransforms, swcConfig));
  const includedSwcTransforms = [...normalTransforms, ...configurableTransforms];
  const supportedSwcTransforms = [...includedSwcTransforms, ...customTransforms];
  return {
    includedSwcTransforms,
    supportedSwcTransforms,
    swcConfig
  };
}
async function babelSwcLoader(source, sourceMap) {
  this.cacheable();
  const callback = this.async();
  const logger = this.getLogger('BabelSwcLoader');
  const options = this.getOptions();
  if (!options.hideParallelModeWarning) {
    (0, _utils.checkParallelModeAvailable)(this, logger);
  }
  const inputSourceMap = sourceMap ? JSON.parse(sourceMap) : undefined;
  const lazyImports = options.lazyImports ?? false;
  const projectRoot = (0, _utils.getProjectRootPath)(this);
  const withSourceMaps = this.resourcePath.match(/node_modules/) ? false : this.sourceMap;
  const baseBabelConfig = {
    caller: {
      name: '@callstack/repack'
    },
    root: projectRoot,
    filename: this.resourcePath,
    sourceMaps: withSourceMaps,
    sourceFileName: this.resourcePath,
    sourceRoot: this.context,
    inputSourceMap: withSourceMaps ? inputSourceMap : undefined,
    ...options.babelOverrides
  };
  try {
    const swc = await (0, _utils.lazyGetSwc)(this);
    // if swc is not available, use babel to transform everything
    if (!swc) {
      const {
        code,
        map
      } = await (0, _babelLoader.transform)(source, baseBabelConfig, {
        hermesParserPath: options.hermesParserPath,
        hermesParserOverrides: options.hermesParserOverrides
      });
      callback(null, code ?? undefined, map ?? undefined);
      return;
    }
    const babelConfig = (0, _utils.getProjectBabelConfig)(this.resourcePath, projectRoot);
    const detectedBabelTransforms = babelConfig.plugins?.map(p => [p.key, p.options]) ?? [];
    const includeBabelPlugins = (0, _utils.getExtraBabelPlugins)(this.resourcePath);
    const {
      includedSwcTransforms,
      supportedSwcTransforms,
      swcConfig
    } = partitionTransforms(this.resourcePath, detectedBabelTransforms);
    const babelResult = await (0, _babelLoader.transform)(source, baseBabelConfig, {
      excludePlugins: supportedSwcTransforms,
      includePlugins: includeBabelPlugins,
      hermesParserPath: options.hermesParserPath,
      hermesParserOverrides: options.hermesParserOverrides
    });
    const finalSwcConfig = {
      ...swcConfig,
      // set env based on babel transforms
      env: {
        // node supports everything and does not include
        // any transforms by default, so it can as a template
        targets: {
          node: 24
        },
        include: includedSwcTransforms
      },
      // set lazy imports based on loader options
      module: {
        ...swcConfig.module,
        lazy: lazyImports,
        type: swcConfig.module.type
      },
      isModule: babelResult.sourceType === 'module'
    };
    const swcResult = swc.transformSync(babelResult?.code, {
      ...finalSwcConfig,
      caller: {
        name: '@callstack/repack'
      },
      filename: this.resourcePath,
      configFile: false,
      swcrc: false,
      root: projectRoot ?? babelConfig.root ?? undefined,
      minify: false,
      sourceMaps: withSourceMaps,
      inputSourceMap: withSourceMaps ? JSON.stringify(babelResult?.map) : undefined,
      sourceFileName: this.resourcePath,
      sourceRoot: this.context,
      ...options.swcOverrides
    });
    callback(null, swcResult?.code, swcResult?.map);
  } catch (error) {
    callback(error);
  }
}