"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSwcLoaderOptions = getSwcLoaderOptions;
function getEnvironmentPreset() {
  return {
    // disable all transforms (node supports everything)
    targets: {
      node: 24
    },
    // add transforms manually that match the RN preset
    include: ['transform-block-scoping', 'transform-class-properties', 'transform-private-methods', 'transform-private-property-in-object', 'transform-classes', 'transform-destructuring', 'transform-async-to-generator', 'transform-async-generator-functions', 'transform-unicode-regex', 'transform-named-capturing-groups-regex', 'transform-optional-chaining',
    // dependencies of some of the transforms above
    'transform-spread', 'transform-object-rest-spread', 'transform-class-static-block']
  };
}
function getCompilerAssumptions() {
  return {
    // Loose mode for: transform-class-properties
    setPublicClassFields: true,
    // Loose mode for: transform-private-fields, transform-private-property-in-object
    privateFieldsAsProperties: true
  };
}
function getParserOptions(syntax, jsx) {
  return syntax === 'js' ? {
    syntax: 'ecmascript',
    jsx: jsx,
    exportDefaultFrom: true
  } : {
    syntax: 'typescript',
    tsx: jsx
  };
}
function getJSCTransformOptions(jsxRuntime, importSource) {
  return {
    react: {
      runtime: jsxRuntime,
      development: jsxRuntime === 'classic',
      importSource
    }
  };
}
function getModuleOptions(disableImportExportTransform, lazyImports = false) {
  return disableImportExportTransform ? undefined : {
    type: 'commonjs',
    strict: false,
    strictMode: false,
    noInterop: false,
    lazy: lazyImports,
    allowTopLevelThis: true,
    ignoreDynamic: true
  };
}

/**
 * Interface for {@link getSwcLoaderOptions} options.
 */

/**
 * Creates SWC loader configuration options for React Native bundling.
 *
 * @param options Configuration options for the SWC loader
 * @param options.syntax The source code syntax type ('js' for JavaScript or 'ts' for TypeScript)
 * @param options.jsx Whether to enable JSX parsing and transformation
 * @param options.externalHelpers Whether to use external helpers for transformations (equivalent of `@babel/runtime`)
 * @param options.jsxRuntime The JSX runtime to use ('automatic' for React 17+ new JSX transform or 'classic' for traditional JSX transform)
 * @param options.disableImportExportTransform Whether to disable transformation of import/export statements
 * @param options.importSource The source module for JSX runtime imports (defaults to 'react')
 * @param options.lazyImports Enable lazy loading for all imports or specific modules
 *
 * @returns SWC loader configuration for the React Native target
 */
function getSwcLoaderOptions({
  syntax,
  jsx,
  externalHelpers = true,
  jsxRuntime = 'automatic',
  disableImportExportTransform = false,
  importSource = 'react',
  lazyImports = false
}) {
  return {
    env: getEnvironmentPreset(),
    jsc: {
      assumptions: getCompilerAssumptions(),
      externalHelpers: externalHelpers,
      parser: getParserOptions(syntax, jsx),
      transform: getJSCTransformOptions(jsxRuntime, importSource)
    },
    module: getModuleOptions(disableImportExportTransform, lazyImports)
  };
}
//# sourceMappingURL=getSwcLoaderOptions.js.map