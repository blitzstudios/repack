import type { FederationRuntimePlugin } from '@module-federation/enhanced/runtime';
import type * as RepackClient from '../ScriptManager/index.js';
export type RepackResolverPluginConfiguration = Omit<RepackClient.ScriptLocator, 'url'> | ((url: string) => Promise<RepackClient.ScriptLocator>);
declare const RepackResolverPlugin: (config?: RepackResolverPluginConfiguration) => FederationRuntimePlugin;
export default RepackResolverPlugin;
