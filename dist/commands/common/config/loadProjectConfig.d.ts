import type { Configuration, ConfigurationObject } from '../../types.js';
export declare function loadProjectConfig<C extends ConfigurationObject>(configFilePath: string): Promise<Configuration<C>>;
