let $loadScript$;
let $caller$ = '';

module.exports = function () {
  $loadScript$ = function loadScript(url, done, key, chunkId) {
    if (key && chunkId) {
      __webpack_require__.repack.loadScript(chunkId, $caller$, done);
    } else {
      __webpack_require__.repack.loadHotUpdate(url, done);
    }
  };
};
//# sourceMappingURL=loadScript.js.map