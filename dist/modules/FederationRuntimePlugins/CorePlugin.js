const RepackCorePlugin = () => ({
  name: 'repack-core-plugin',
  loadEntry: async ({
    remoteInfo
  }) => {
    const client = require('../ScriptManager/index.js');
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
      console.error(`Failed to load remote entry: ${entryGlobalName}`);
    }
  },
  generatePreloadAssets: async () => {
    // noop for compatibility
    return Promise.resolve({
      cssAssets: [],
      jsAssetsWithoutEntry: [],
      entryAssets: []
    });
  }
});
export default RepackCorePlugin;
//# sourceMappingURL=CorePlugin.js.map