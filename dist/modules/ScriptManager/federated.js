import { ScriptManager } from './ScriptManager';

/**
 * Namespace for runtime utilities for Module Federation.
 */
export let Federated;

(function (_Federated) {
  /**
   * Resolves URL to a container or a chunk when using Module Federation,
   * based on given `scriptId` and `caller`.
   */

  /**
   * Configuration options for {@link createURLResolver} for Module Federation.
   * Allows to configure how created {@link URLResolver} will behave.
   */
  function createURLResolver(config) {
    const resolvers = {};

    for (const key in config.containers) {
      resolvers[key] = (scriptId, caller) => {
        if (scriptId === key) {
          const url = config.containers[key].replace(/\[name\]/g, scriptId).replace(/\[ext\]/g, '.container.bundle');
          return url;
        }

        if (caller === key) {
          const url = (config.chunks?.[key] ?? config.containers[key]).replace(/\[name\]/g, scriptId);

          if (url.includes('[ext]')) {
            return webpackContext => webpackContext.u(url.replace(/\[ext\]/g, ''));
          }

          return url;
        }

        return undefined;
      };
    }

    return (scriptId, caller) => {
      const resolver = (caller ? resolvers[caller] : undefined) ?? resolvers[scriptId];
      return resolver(scriptId, caller);
    };
  }

  _Federated.createURLResolver = createURLResolver;

  async function importModule(containerName, module, scope = 'default') {
    if (!__webpack_share_scopes__[scope] || !__webpack_share_scopes__[scope].__isInitialized) {
      // Initializes the share scope.
      // This fills it with known provided modules from this build and all remotes.
      await __webpack_init_sharing__(scope);
      __webpack_share_scopes__[scope].__isInitialized = true;
    } // Do not use `const container = self[containerName];` here. Once container is loaded
    // `container` reference is not updated, so `container.__isInitialized`
    // will crash the application, because of reading property from `undefined`.


    if (!self[containerName]) {
      // Download and execute container
      await ScriptManager.shared.loadScript(containerName);
    }

    const container = self[containerName];

    if (!container.__isInitialized) {
      container.__isInitialized = true; // Initialize the container, it may provide shared modules

      await container.init(__webpack_share_scopes__[scope]);
    }

    const factory = await container.get(module);
    const exports = factory();
    return exports;
  }

  _Federated.importModule = importModule;
})(Federated || (Federated = {}));
//# sourceMappingURL=federated.js.map