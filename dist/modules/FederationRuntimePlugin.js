const repackFederationRuntimePlugin = () => ({
  name: 'repack-federation-runtime-plugin',
  afterResolve(args) {
    const {
      ScriptManager
    } = require('./ScriptManager');
    const {
      remoteInfo
    } = args;
    ScriptManager.shared.addResolver(async (scriptId, caller, referenceUrl) => {
      if (scriptId === remoteInfo.entryGlobalName) {
        return {
          url: remoteInfo.entry
        };
      }
      if (referenceUrl && caller === remoteInfo.entryGlobalName) {
        const publicPath = remoteInfo.entry.split('/').slice(0, -1).join('/');
        const bundlePath = scriptId + referenceUrl.split(scriptId)[1];
        return {
          url: publicPath + '/' + bundlePath
        };
      }
    }, {
      key: remoteInfo.entryGlobalName
    });
    return args;
  },
  loadEntry: async ({
    remoteInfo
  }) => {
    const client = require('./ScriptManager');
    const {
      ScriptManager,
      getWebpackContext
    } = client;
    const {
      entry,
      entryGlobalName
    } = remoteInfo;
    try {
      await ScriptManager.shared.loadScript(entryGlobalName, undefined, getWebpackContext(), entry);

      // @ts-ignore
      if (!globalThis[entryGlobalName]) {
        throw new Error();
      }

      // @ts-ignore
      return globalThis[entryGlobalName];
    } catch {
      console.error(`Failed to load ${entryGlobalName} entry`);
    }
  }
});
export default repackFederationRuntimePlugin;
//# sourceMappingURL=FederationRuntimePlugin.js.map