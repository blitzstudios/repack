import type { TurboModule } from 'react-native';
export interface Spec extends TurboModule {
    loadScript(scriptId: string, config: Object): Promise<Object>;
    prefetchScript(scriptId: string, config: Object): Promise<Object>;
    invalidateScripts(scripts: Array<string>): Promise<string>;
}
declare const _default: Spec;
export default _default;
