import type { FederationRuntimePlugin } from '@module-federation/enhanced/runtime';
import type { ScriptLocator } from '../ScriptManager/index.js';
export type RepackResolverPluginConfiguration = Omit<ScriptLocator, 'url'> | ((url: string) => Promise<ScriptLocator>);
declare const RepackResolverPlugin: (config?: RepackResolverPluginConfiguration) => FederationRuntimePlugin;
export default RepackResolverPlugin;
