"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validatePlugins = validatePlugins;
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _colorette = require("colorette");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DEPENDENCIES_WITH_SEPARATE_PLUGINS = {
  'react-native-reanimated': {
    plugin: 'ReanimatedPlugin',
    path: 'plugin-reanimated',
    bundler: 'rspack'
  },
  nativewind: {
    plugin: 'NativeWindPlugin',
    path: 'plugin-nativewind'
  },
  expo: {
    plugin: 'ExpoModulesPlugin',
    path: 'plugin-expo-modules'
  }
};
async function validatePlugins(rootDir, plugins, bundler) {
  let dependencies = [];
  const activePlugins = new Set(plugins.map(plugin => plugin?.constructor.name).filter(pluginName => pluginName !== undefined));
  try {
    const packageJsonPath = _nodePath.default.join(rootDir, 'package.json');
    const packageJson = _nodeFs.default.readFileSync(packageJsonPath, 'utf-8');
    dependencies = Object.keys(JSON.parse(packageJson).dependencies || {});
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.debug('Could not find package.json in your project root:', rootDir);
      return;
    }
    console.debug('Failed to parse package.json:', error);
  }
  dependencies.filter(dependency => {
    const plugin = DEPENDENCIES_WITH_SEPARATE_PLUGINS[dependency];
    if (!plugin) {
      return false;
    }
    return plugin.bundler ? plugin.bundler === bundler : true;
  }).forEach(dependency => {
    const requiredPlugin = DEPENDENCIES_WITH_SEPARATE_PLUGINS[dependency];
    if (!activePlugins.has(requiredPlugin.plugin)) {
      console.warn(`${(0, _colorette.bold)('WARNING:')} Detected ${(0, _colorette.bold)(dependency)} package which requires ${(0, _colorette.bold)(requiredPlugin.plugin)} plugin but it's not configured. ` + `Please add the following to your configuration file. \nRead more https://github.com/callstack/repack/tree/main/packages/${requiredPlugin.path}/README.md.`);
    }
  });
}