import { validate } from 'schema-utils';
/**
 * {@link CodeSigningPlugin} configuration options.
 */
export interface CodeSigningPluginConfig {
    /** Whether the plugin is enabled. Defaults to true */
    enabled?: boolean;
    /** Path to the private key. */
    privateKeyPath: string;
    /** Names of chunks to exclude from being signed. */
    excludeChunks?: string[] | RegExp | RegExp[];
}
type Schema = Parameters<typeof validate>[0];
export declare const optionsSchema: Schema;
export declare function validateConfig(config: CodeSigningPluginConfig): void;
export {};
