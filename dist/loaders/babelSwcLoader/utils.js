"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkParallelModeAvailable = checkParallelModeAvailable;
exports.getExtraBabelPlugins = getExtraBabelPlugins;
exports.getProjectBabelConfig = getProjectBabelConfig;
exports.getProjectRootPath = getProjectRootPath;
exports.getSwcParserConfig = getSwcParserConfig;
exports.isTSXSource = isTSXSource;
exports.isTypeScriptSource = isTypeScriptSource;
exports.lazyGetSwc = void 0;
var _core = require("@babel/core");
function isTypeScriptSource(fileName) {
  return !!fileName && fileName.endsWith('.ts');
}
function isTSXSource(fileName) {
  return !!fileName && fileName.endsWith('.tsx');
}
function getProjectBabelConfig(filename, projectRoot) {
  const babelConfig = (0, _core.loadOptions)({
    caller: {
      name: '@callstack/repack'
    },
    filename,
    root: projectRoot
  });
  return babelConfig ?? {};
}
function getExtraBabelPlugins(filename) {
  const extraBabelPlugins = [];
  // add TS syntax plugins since RN preset
  // only uses transform-typescript plugin
  // which includes the syntax-typescript plugin
  if (isTypeScriptSource(filename)) {
    extraBabelPlugins.push(['@babel/plugin-syntax-typescript', {
      isTSX: false,
      allowNamespaces: true
    }]);
  } else if (isTSXSource(filename)) {
    extraBabelPlugins.push(['@babel/plugin-syntax-typescript', {
      isTSX: true,
      allowNamespaces: true
    }]);
  }
  return extraBabelPlugins;
}
function getSwcParserConfig(filename) {
  if (isTypeScriptSource(filename)) {
    return {
      syntax: 'typescript',
      tsx: false
    };
  }
  if (isTSXSource(filename)) {
    return {
      syntax: 'typescript',
      tsx: true
    };
  }
  // include JSX in .js files
  return {
    syntax: 'ecmascript',
    jsx: true
  };
}
function isWebpackBackend(loaderContext) {
  // parallel loader in Rspack has mocked compiler object without most props
  // but in non-parallel mode, full compiler object is available so we can do the proper check
  // we distinguish between parallel and non-parallel mode by checking if the compiler has a version property
  // and then proceed to check if it's a Rspack compiler the official way
  if ('webpack' in loaderContext._compiler && 'version' in loaderContext._compiler.webpack && loaderContext._compiler.webpack.version) {
    return !('rspackVersion' in loaderContext._compiler.webpack);
  }
  // in threaded-loader mode, _compiler.webpack is undefined
  // loaderContext.webpack exists in webpack but not in Rspack
  // in case it's added in the future, it should be followed by similar rspack prop
  if ('webpack' in loaderContext && loaderContext.webpack) {
    return !('rspack' in loaderContext && loaderContext.rspack);
  }
  // if both checks fail, we assume it's a Rspack compiler
  return false;
}
const disabledParalleModeWarning = ['You have enabled `experiments.parallelLoader` but forgot to enable it for this loader.', 'To enable parallel mode for this loader you need to add `parallel: true` to the loader rule.', 'See how to do it in the official Rspack docs:', 'https://rspack.rs/config/experiments#experimentsparallelloader.', 'If this is intentional, you can disable this warning', 'by setting `hideParallelModeWarning` in the loader options.'].join(' ');
let parallelModeWarningDisplayed = false;
function checkParallelModeAvailable(loaderContext, logger) {
  // only Rspack supports parallel mode
  if (parallelModeWarningDisplayed || isWebpackBackend(loaderContext)) {
    return;
  }
  // in parallel mode compiler.options.experiments are not available
  // but since we're already running in parallel mode, we can ignore this check
  if (loaderContext._compiler.options?.experiments?.parallelLoader) {
    parallelModeWarningDisplayed = true;
    logger.warn(disabledParalleModeWarning);
  }
}
function getProjectRootPath(loaderContext) {
  // parallel loaders in Rspack had a bug where rootContext
  // was the same as context, so we check if they are different
  if (loaderContext.rootContext !== loaderContext.context) {
    return loaderContext.rootContext;
  }
  return undefined;
}
function safelyResolve(path, from) {
  try {
    return require.resolve(path, {
      paths: [from]
    });
  } catch {
    return null;
  }
}
async function getSwcModule(loaderContext) {
  const projectRoot = getProjectRootPath(loaderContext) ?? process.cwd();
  const isWebpack = isWebpackBackend(loaderContext);
  if (!isWebpack) {
    // happy path - rspack & exposed swc
    // use optional chaining to avoid type errors when using parallel loader
    if (loaderContext._compiler.rspack?.experiments?.swc) {
      return loaderContext._compiler.rspack.experiments.swc;
    }
    // fallback to checking for `@rspack/core` installed in the project
    // use optional chaining to avoid type errors when there is no experiments.swc
    const rspackCorePath = safelyResolve('@rspack/core', projectRoot);
    if (rspackCorePath && !isWebpack) {
      const rspack = await import(rspackCorePath);
      if ('default' in rspack) {
        return rspack.default?.experiments?.swc ?? null;
      }
      if (rspack) {
        return rspack?.experiments?.swc ?? null;
      }
    }
  }
  // fallback to checking for `@swc/core` installed in the project
  // this can be in both webpack & rspack projects
  const swcCorePath = safelyResolve('@swc/core', projectRoot);
  if (swcCorePath) {
    const swc = await import(swcCorePath);
    if ('default' in swc) {
      return swc.default;
    }
    if (swc) {
      return swc;
    }
  }
  // at this point, we've tried all possible ways to get swc and failed
  return null;
}
function createLazyGetSwc() {
  let swc;
  const getSwc = async loaderContext => {
    if (swc === undefined) {
      swc = getSwcModule(loaderContext);
    }
    return await swc;
  };
  return getSwc;
}
const lazyGetSwc = exports.lazyGetSwc = createLazyGetSwc();