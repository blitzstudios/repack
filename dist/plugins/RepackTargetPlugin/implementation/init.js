var $globalObject$;
module.exports = function () {
  var repackRuntime = {
    shared: $globalObject$.__repack__ && $globalObject$.__repack__.shared || __webpack_require__.repack && __webpack_require__.repack.shared || {
      scriptManager: undefined,
      enqueuedResolvers: []
    }
  };
  __webpack_require__.repack = $globalObject$.__repack__ = repackRuntime;
};