"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moveElementBefore = moveElementBefore;
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
//# sourceMappingURL=moveElementBefore.js.map