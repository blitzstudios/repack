"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Federated = void 0;

var _url = require("url");

var _dedent = _interopRequireDefault(require("dedent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Namespace for utilities for Module Federation.
 */
let Federated;
exports.Federated = Federated;

(function (_Federated) {
  const SHARED_REACT = _Federated.SHARED_REACT = {
    singleton: true,
    eager: true
  };
  const SHARED_REACT_NATIVE = _Federated.SHARED_REACT_NATIVE = {
    singleton: true,
    eager: true
  };

  function createRemote(remote) {
    const [remoteName, url] = remote.split('@');

    if (!url) {
      if (remote.includes('@')) {
        throw new Error('Missing URL after @. Use `dynamic` or provide full URL to container bundle.');
      } else {
        throw new Error('Remote must provide @ with either full URL to container bundle or `dynamic`.');
      }
    }

    const containerUrl = url === 'dynamic' ? undefined : url;
    const chunksUrl = url === 'dynamic' ? undefined : new _url.URL('[name][ext]', url).href;
    const defaultResolver = containerUrl ? (0, _dedent.default)`
          scriptManager.addResolver(function (scriptId, caller) {
            if (scriptId === '${remoteName}') {
              return {
                url: '${containerUrl}',
              };
            }
          }, { priority: 0 });

          scriptManager.addResolver(function (scriptId, caller) {
            if (caller === '${remoteName}') {
              return {
                url: (webpackContext) => '${chunksUrl}'.replace('[name][ext]', webpackContext.u(scriptId)),
              };
            }
          }, { priority: 0 });
        ` : '';
    return (0, _dedent.default)`promise new Promise((resolve, reject) => {
      function resolveRemote() {
        resolve({
          get: (request) => {
            return self.${remoteName}.get(request);
          },
          init: (arg) => {
            if (!self.${remoteName}.__isInitialized) {
              try {
                self.${remoteName}.__isInitialized = true;
                return self.${remoteName}.init(arg);
              } catch (e) {
                console.log('[Repack/Federated] Remote container ${remoteName} already initialized.');
              }
            }
          }
        });
      }

      if (self.${remoteName}) {
        return resolveRemote();
      }
      var scriptManager = __webpack_require__.repack.shared.scriptManager;

      ${defaultResolver}

      scriptManager
        .loadScript('${remoteName}', undefined, __webpack_require__)
        .then(function() {
          resolveRemote();
        })
        .catch(function(reason) {
          reject(reason);
        });
    })`;
  }

  _Federated.createRemote = createRemote;
})(Federated || (exports.Federated = Federated = {}));
//# sourceMappingURL=federated.js.map