"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isIgnoredRepackDeepImport = isIgnoredRepackDeepImport;
exports.isTSXSource = isTSXSource;
exports.isTypeScriptSource = isTypeScriptSource;
exports.loadHermesParser = loadHermesParser;
function isTypeScriptSource(fileName) {
  return !!fileName && fileName.endsWith('.ts');
}
function isTSXSource(fileName) {
  return !!fileName && fileName.endsWith('.tsx');
}
function resolveHermesParser(projectRoot) {
  const reactNativeBabelPresetPath = require.resolve('@react-native/babel-preset', {
    paths: [projectRoot]
  });
  const babelPluginSyntaxHermesParserPath = require.resolve('babel-plugin-syntax-hermes-parser', {
    paths: [reactNativeBabelPresetPath]
  });
  const hermesParserPath = require.resolve('hermes-parser', {
    paths: [babelPluginSyntaxHermesParserPath]
  });
  return hermesParserPath;
}
async function loadHermesParser(projectRoot, providedHermesParserPath) {
  try {
    const hermesParserPath = providedHermesParserPath ?? resolveHermesParser(projectRoot ?? process.cwd());
    const hermesParser = await import(hermesParserPath);
    return hermesParser;
  } catch (e) {
    console.error(e);
    throw new Error(`Failed to import 'hermes-parser'. Make sure you have '@react-native/babel-preset' installed in your project.`);
  }
}
const IGNORED_REPACK_FILENAMES = ['IncludeModules.js', 'WebpackHMRClient.js'].map(name => name.replace(/\./g, '\\.'));
const IGNORED_REPACK_PATHS_REGEX = new RegExp(`repack/dist/modules/(${IGNORED_REPACK_FILENAMES.join('|')})$`);
function isIgnoredRepackDeepImport(filename) {
  return IGNORED_REPACK_PATHS_REGEX.test(filename);
}