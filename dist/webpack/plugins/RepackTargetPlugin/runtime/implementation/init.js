const $chunkId$ = '';
const $chunkLoadingGlobal$ = '';
const $globalObject$ = {};
const $hmrEnabled$ = false;

module.exports = function () {
  var repackRuntime = {
    loadScript,
    loadHotUpdate,
    shared: $globalObject$.__repack__ && $globalObject$.__repack__.shared || __webpack_require__.repack && __webpack_require__.repack.shared || {
      loadScriptCallback: [],
      scriptManager: undefined
    }
  };
  __webpack_require__.repack = $globalObject$.__repack__ = repackRuntime;

  (function () {
    function repackLoadScriptCallback(parentPush, data) {
      if (parentPush) {
        parentPush(data);
      }

      var chunkIds = data[0];
      var i = 0;

      for (; i < chunkIds.length; i++) {
        repackRuntime.shared.loadScriptCallback.push([chunkIds[i], $chunkId$]);
      }
    }

    var chunkLoadingGlobal = $globalObject$[$chunkLoadingGlobal$] = $globalObject$[$chunkLoadingGlobal$] || [];
    chunkLoadingGlobal.push = repackLoadScriptCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
  })();

  (function () {
    function repackScriptStartup() {
      repackRuntime.shared.loadScriptCallback.push([$chunkId$]);
    }

    var startupFunctions = __webpack_require__.x ? [__webpack_require__.x, repackScriptStartup] : [repackScriptStartup];

    function startupFunction() {
      var results;

      for (var i = 0; i < startupFunctions.length; i++) {
        results = startupFunctions[i].apply(this, arguments);
      }

      return results;
    }

    Object.defineProperty(__webpack_require__, 'x', {
      get() {
        return startupFunction;
      },

      set(fn) {
        startupFunctions.push(fn);
      }

    });
  })();

  function loadScript(name, caller, done) {
    if (repackRuntime.shared.scriptManager) {
      repackRuntime.shared.scriptManager.loadScript(name, caller, __webpack_require__).then(function () {
        done();
        return;
      }).catch(function (reason) {
        console.error('[RepackRuntime] Loading script failed:', reason);
        done({
          type: 'exec',
          target: {
            src: name
          }
        });
      });
    } else {
      console.error('[RepackRuntime] Script manager was not provided');
      done({
        type: 'exec',
        target: {
          src: name
        }
      });
    }
  }

  function loadHotUpdate(url, done) {
    if (!$hmrEnabled$) {
      console.error('[RepackRuntime] Loading HMR update chunks is disabled');
      done({
        type: 'disabled',
        target: {
          src: url
        }
      });
      return;
    }

    fetch(url).then(function (response) {
      if (!response.ok) {
        console.error('[RepackRuntime] Loading HMR update failed:', response.statusText);
        done({
          type: response.statusText,
          target: {
            src: url
          }
        });
        return;
      }

      return response.text();
    }).then(function (script) {
      if (script) {
        const globalEvalWithSourceUrl = self.globalEvalWithSourceUrl;
        (function () {
          if (globalEvalWithSourceUrl) {
            globalEvalWithSourceUrl(script, null);
          } else {
            eval(script);
          }
        }).call(self);
        done();
      }

      return;
    }).catch(function (reason) {
      console.error('[RepackRuntime] Loading HMR update chunk failed:', reason);
      done({
        type: 'exec',
        target: {
          src: url
        }
      });
    });
  }
};
//# sourceMappingURL=init.js.map