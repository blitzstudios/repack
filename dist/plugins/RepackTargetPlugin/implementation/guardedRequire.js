var $globalObject$;
module.exports = function () {
  var inGuard = false;
  var originalWebpackRequire = __webpack_require__;
  function guardedWebpackRequire(moduleId) {
    if (!inGuard && $globalObject$.ErrorUtils) {
      inGuard = true;
      let exports;
      try {
        exports = originalWebpackRequire(moduleId);
      } catch (e) {
        $globalObject$.ErrorUtils.reportFatalError(e);
      }
      inGuard = false;
      return exports;
    } else {
      return originalWebpackRequire(moduleId);
    }
  }
  Object.getOwnPropertyNames(originalWebpackRequire).forEach(key => {
    guardedWebpackRequire[key] = originalWebpackRequire[key];
  });
  __webpack_require__ = guardedWebpackRequire;
};
//# sourceMappingURL=guardedRequire.js.map