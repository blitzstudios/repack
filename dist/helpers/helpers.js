"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adaptFilenameToPlatform = adaptFilenameToPlatform;
exports.isRspackCompiler = isRspackCompiler;
exports.isTruthyEnv = isTruthyEnv;
exports.moveElementBefore = moveElementBefore;
var _nodeOs = _interopRequireDefault(require("node:os"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// reference: https://github.com/web-infra-dev/rspack/discussions/2640
function isRspackCompiler(compiler) {
  return 'rspackVersion' in compiler.webpack;
}
function isTruthyEnv(env) {
  return !!env && env !== 'false' && env !== '0';
}
function adaptFilenameToPlatform(filename) {
  if (_nodeOs.default.platform() !== 'win32') return filename;
  return filename.replace(/\\/g, '/');
}
function matchElement(value, tester) {
  if (!value) return false;
  if (typeof tester === 'string') return value === tester;
  return tester.test(value);
}
function moveElementBefore(array, {
  beforeElement,
  elementToMove,
  getElement = item => item
}) {
  const sourceIndex = array.findIndex(item => matchElement(getElement(item), elementToMove));
  if (sourceIndex === -1) return;
  const targetIndex = array.findIndex(item => matchElement(getElement(item), beforeElement));
  if (targetIndex === -1) return;

  // target order already achieved
  if (sourceIndex < targetIndex) return;

  // Remove source element from its current position
  const [moveElement] = array.splice(sourceIndex, 1);

  // Insert source element right before the target element
  array.splice(targetIndex, 0, moveElement);
}