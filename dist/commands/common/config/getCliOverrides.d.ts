import type { BundleArguments, ConfigurationObject, StartArguments } from '../../types.js';
interface GetCliOverridesOptions {
    args: StartArguments | BundleArguments;
    command: 'start' | 'bundle';
}
export declare function getCliOverrides<C extends ConfigurationObject>(opts: GetCliOverridesOptions): Partial<C>;
export {};
