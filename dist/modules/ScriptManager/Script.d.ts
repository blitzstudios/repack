import type { NormalizedScriptLocator, ScriptLocator, WebpackContext } from './types';
/**
 * Representation of a Script to load and execute, used by {@link ScriptManager}.
 *
 * When adding resolvers to `ScriptManager` in `ScriptManager.shared.addResolver(...)`, you can use
 * `Script.getDevServerURL(...)`, `Script.getFileSystemURL(...)` or `Script.getRemoteURL(...)`
 * to create a `url` for the script.
 *
 * Other methods are designed for internal use only.
 */
export declare class Script {
    readonly scriptId: string;
    readonly caller: string | undefined;
    readonly locator: NormalizedScriptLocator;
    readonly cache: boolean;
    static DEFAULT_TIMEOUT: number;
    /**
     * Get URL of a script hosted on development server.
     *
     * @param scriptId Id of the script.
     */
    static getDevServerURL(scriptId: string): (webpackContext: WebpackContext) => string;
    /**
     * Get URL of a script stored on filesystem on the target mobile device.
     *
     * @param scriptId Id of the script.
     */
    static getFileSystemURL(scriptId: string): (webpackContext: WebpackContext) => string;
    /**
     * Get URL of a script hosted on a remote server.
     *
     * By default `.chunk.bundle` extension will be added to the URL.
     * If your script has different extension, you should pass `{ excludeExtension: true }` as 2nd argument.
     *
     * @param url A URL to remote location where the script is stored.
     * @param options Additional options.
     */
    static getRemoteURL(url: string, options?: {
        excludeExtension?: boolean;
    }): string | ((webpackContext: WebpackContext) => string);
    /**
     * Create new instance of `Script` from non-normalized script locator data.
     *
     * @param locator Non-normalized locator data.
     * @param fetch Initial flag for whether script should be fetched or not.
     *
     * @internal
     */
    static from(key: {
        scriptId: string;
        caller?: string;
    }, locator: ScriptLocator, fetch: boolean): Script;
    /**
     * Constructs new representation of a script.
     *
     * @param locator Normalized locator data.
     * @param cache Flag whether use cache or not, `true` by default.
     *
     * @internal
     */
    constructor(scriptId: string, caller: string | undefined, locator: NormalizedScriptLocator, cache?: boolean);
    /**
     * Check if the script was already cached and cache should be updated with new data.
     *
     * @param cachedData Cached data for the same script.
     *
     * @internal
     */
    shouldUpdateCache(cachedData: Pick<NormalizedScriptLocator, 'method' | 'url' | 'query' | 'headers' | 'body'>): boolean;
    /**
     * Check if the script should be fetched again or reused,
     * based on previous cached data.
     *
     * @param cachedData Cached data for the same script.
     *
     * @internal
     */
    shouldRefetch(cachedData: Pick<NormalizedScriptLocator, 'method' | 'url' | 'query' | 'headers' | 'body'>): boolean;
    /**
     * Check if previous cached data is the same as the new one.
     *
     * @param cachedData Cached data for the same script.
     *
     * @internal
     */
    checkIfCacheDataOutdated(cachedData: Pick<NormalizedScriptLocator, 'method' | 'url' | 'query' | 'headers' | 'body'>): boolean;
    /**
     * Get object to store in cache.
     *
     * @internal
     */
    getCacheData(): {
        method: "GET" | "POST";
        url: string;
        query: string | undefined;
        headers: Record<string, string> | undefined;
        body: string | undefined;
    };
    toObject(): {
        scriptId: string;
        caller: string | undefined;
        locator: NormalizedScriptLocator;
        cache: boolean;
    };
}
