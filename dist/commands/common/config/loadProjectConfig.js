"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadProjectConfig = loadProjectConfig;
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _nodeUrl = _interopRequireDefault(require("node:url"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// logic based on crossImport from `rspack-cli`
// reference: https://github.com/web-infra-dev/rspack/blob/b16a723d974231eb5a39fcbfd3258b283be8b3c9/packages/rspack-cli/src/utils/crossImport.ts

const readPackageUp = cwd => {
  let currentDir = _nodePath.default.resolve(cwd);
  let packageJsonPath = _nodePath.default.join(currentDir, 'package.json');
  while (!_nodeFs.default.existsSync(packageJsonPath)) {
    const parentDir = _nodePath.default.dirname(currentDir);
    if (parentDir === currentDir) return null;
    currentDir = parentDir;
    packageJsonPath = _nodePath.default.join(currentDir, 'package.json');
  }
  try {
    const packageJson = _nodeFs.default.readFileSync(packageJsonPath, 'utf8');
    return JSON.parse(packageJson);
  } catch {
    return null;
  }
};
const isEsmFile = filePath => {
  if (filePath.endsWith('.mjs') || filePath.endsWith('.mts')) return true;
  if (filePath.endsWith('.cjs') || filePath.endsWith('.cts')) return false;
  const packageJson = readPackageUp(_nodePath.default.dirname(filePath));
  return packageJson?.type === 'module';
};
async function loadProjectConfig(configFilePath) {
  let config;
  if (isEsmFile(configFilePath)) {
    const {
      href: fileUrl
    } = _nodeUrl.default.pathToFileURL(configFilePath);
    config = await import(fileUrl);
  } else {
    config = require(configFilePath);
  }
  if ('default' in config) {
    config = config.default;
  }
  return config;
}