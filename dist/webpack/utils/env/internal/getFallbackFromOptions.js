"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFallbackFromOptions = getFallbackFromOptions;

function getFallbackFromOptions({
  fallback
}) {
  return fallback instanceof Function && 'call' in fallback ? fallback.call(undefined) : fallback;
}
//# sourceMappingURL=getFallbackFromOptions.js.map