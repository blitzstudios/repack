import EventEmitter from 'events';
import { type NormalizedScriptLocator } from './NativeScriptManager';
import type { ScriptLocatorResolver, StorageApi } from './types';
type Cache = Record<string, Pick<NormalizedScriptLocator, 'method' | 'url' | 'query' | 'headers' | 'body'>>;
type ScriptsPromises = Record<string, (Promise<void> & {
    isPrefetch?: true;
}) | undefined>;
export interface ResolverOptions {
    /**
     * Priority of the resolver. Defaults to `2`.
     * Resolvers are called based on the highest priority,
     * so higher the number, the higher priority the resolver gets.
     */
    priority?: number;
    /**
     * Unique key to identify the resolver.
     * If not provided, the resolver will be added unconditionally.
     * If provided, the new resolver will be replace the existing one configured with the same `uniqueKey`.
     */
    key?: string;
}
/**
 * A manager to ease resolution, downloading and executing additional code from:
 * - arbitrary JavaScript scripts
 * - Webpack chunks
 * - Webpack bundles
 * - Webpack MF containers
 *
 * ScriptManager is globally available under `ScriptManager.shared` in main bundle, chunks and containers.
 *
 * Use `ScriptManager.shared` instead of creating new instance of `ScriptManager`.
 *
 * This API is mainly useful, if you are working with any form of Code Splitting.
 *
 * `ScriptManager` is also an `EventEmitter` and emits the following events:
 * - `resolving` with `{ scriptId, caller }`
 * - `resolved` with `scriptId: string, caller?: string, locator: NormalizedScriptLocator, cache: boolean`
 * - `prefetching` with `scriptId: string, caller?: string, locator: NormalizedScriptLocator, cache: boolean`
 * - `loading` with `scriptId: string, caller?: string, locator: NormalizedScriptLocator, cache: boolean`
 * - `loaded` with `scriptId: string, caller?: string, locator: NormalizedScriptLocator, cache: boolean`
 * - `error` with `error: Error`
 *
 * Example of using this API with async Webpack chunk:
 * ```js
 * import * as React from 'react';
 * import { ScriptManager, Script } from '@callstack/repack/client';
 *
 * ScriptManager.shared.addResolver(async (scriptId) => {
 *   if (__DEV__) {
 *     return {
 *       url: Script.getDevServerURL(scriptId);
 *       cache: false,
 *     };
 *   }
 *
 *   return {
 *     url: Script.getRemoteURL(`http://domain.exaple/apps/${scriptId}`),
 *   };
 * });
 *
 * // ScriptManager.shared.loadScript is called internally when running `import()`
 * const TeacherModule = React.lazy(() => import('./Teacher.js'));
 * const StudentModule = React.lazy(() => import('./Student.js'));
 *
 * export function App({ role }) {
 *   if (role === 'teacher') {
 *     return <TeacherModule />;
 *   }
 *
 *   return <StudentModule />
 * }
 * ```
 */
export declare class ScriptManager extends EventEmitter {
    private nativeScriptManager;
    static init(): void;
    static get shared(): ScriptManager;
    protected cache: Cache;
    protected scriptsPromises: ScriptsPromises;
    protected cacheInitialized: boolean;
    protected resolvers: [string, number, ScriptLocatorResolver][];
    protected storage?: StorageApi;
    /**
     * Constructs instance of `ScriptManager`.
     *
     * __Should not be called directly__ - use `ScriptManager.shared`.
     *
     * @internal
     */
    protected constructor(nativeScriptManager?: import("./NativeScriptManager").Spec);
    /**
     * Sets a storage backend to cache resolved scripts locator data.
     *
     * The stored data is used to detect if scripts locator data of previously downloaded
     * script hasn't changed to avoid over-fetching the script.
     *
     * @param storage Implementation of storage functions.
     */
    setStorage(storage?: StorageApi): void;
    /**
     * Adds new script locator resolver.
     *
     * Resolver is an async function to resolve script locator data - in other words, it's a function to
     * tell the {@link ScriptManager} how to fetch the script.
     *
     * There's no limitation on what logic you can run inside this function - it can include:
     * - fetching/loading remote config
     * - fetching/loading feature flags
     * - fetching/loading A/B testing data
     * - calling native modules
     * - running arbitrary logic
     *
     * @param resolver Resolver function to add.
     * @param options Resolver options.
     */
    addResolver(resolver: ScriptLocatorResolver, options?: ResolverOptions): void;
    /**
     * Removes previously added resolver.
     *
     * @param resolver Resolver function or resolver's `uniqueKey` to remove.
     * @returns `true` if resolver was found and removed, `false` otherwise.
     */
    removeResolver(resolver: ScriptLocatorResolver | string): boolean;
    /**
     * Removes all previously added resolvers.
     */
    removeAllResolvers(): void;
    protected initCache(): Promise<void>;
    protected saveCache(): Promise<void>;
    protected handleError(error: any, message: string, ...args: any[]): void;
    /**
     * Resolves a {@link Script} instance with normalized locator data.
     *
     * Resolution will use previously added (via `ScriptManager.shared.addResolver(...)`) resolvers
     * in series, util one returns a locator data or will throw if no resolver handled the request.
     *
     * Use `ScriptManager.shared.on('resolving', ({ scriptId, caller }) => { })` to listen for when
     * the script resolution begins.
     *
     * Use `ScriptManager.shared.on('resolved', (script) => { })` to listen for when
     * the script's locator data is resolved.
     *
     * @param scriptId Id of the script to resolve.
     * @param caller Name of the calling script - it can be for example: name of the bundle, chunk or container.
     */
    resolveScript(scriptId: string, caller?: string, webpackContext?: import("./types").WebpackContext, referenceUrl?: string): Promise<any>;
    private updateCache;
    /**
     * Resolves given script's location, downloads and executes it.
     * The execution of the code is handled internally by threading in React Native.
     *
     * Use `ScriptManager.shared.on('loading', (script) => { })` to listen for when
     * the script is about to be loaded.
     *
     * Use `ScriptManager.shared.on('loaded', (script) => { })` to listen for when
     * the script is loaded.
     *
     * @param scriptId Id of the script to load.
     * @param caller Name of the calling script - it can be for example: name of the bundle, chunk or container.
     */
    loadScript(scriptId: string, caller?: string, webpackContext?: import("./types").WebpackContext, referenceUrl?: string): Promise<void>;
    /**
     * Loads a script with retry logic.
     *
     * This function attempts to load a script using the nativeScriptManager.
     * If the initial attempt fails, it retries the specified number of times
     * with an optional delay between retries.
     *
     * @param {string} scriptId - The ID of the script to load.
     * @param {NormalizedScriptLocator} locator - An NormalizedScriptLocator containing retry configuration.
     * @param {number} [locator.retry=0] - The number of retry attempts.
     * @param {number} [locator.retryDelay=0] - The delay in milliseconds between retries.
     * @throws {Error} Throws an error if all retry attempts fail.
     */
    protected loadScriptWithRetry(scriptId: string, locator: NormalizedScriptLocator & {
        retryDelay?: number;
        retry?: number;
    }): Promise<void>;
    /**
     * Resolves given script's location and downloads it without executing.
     * This function can be awaited to detect if the script was downloaded and for error handling.
     *
     * Use `ScriptManager.shared.on('prefetching', (script) => { })` to listen for when
     * the script's prefetch beings.
     *
     * @param scriptId Id of the script to prefetch.
     * @param caller Name of the calling script - it can be for example: name of the bundle, chunk or container.
     */
    prefetchScript(scriptId: string, caller?: string, webpackContext?: import("./types").WebpackContext): Promise<void>;
    /**
     * Clears the cache (if configured in {@link ScriptManager.setStorage}) and removes downloaded
     * files for given scripts from the filesystem. This function can be awaited to detect if the
     * scripts were invalidated and for error handling.
     *
     * Use `ScriptManager.shared.on('invalidated', (scriptIds) => { })` to listen for when
     * the invalidation completes.
     *
     * @param scriptIds Array of script ids to clear from cache and remove from filesystem.
     * @returns Array of script ids that were invalidated.
     */
    invalidateScripts(scriptIds: string[]): Promise<string[] | undefined>;
    /**
     * Evaluates a script synchronously.
     *
     * This function sends the script source and its URL to the native script manager for evaluation.
     * It is functionally identical to `globalEvalWithSourceUrl`.
     *
     * @param scriptSource The source code of the script to evaluate.
     * @param scriptSourceUrl The URL of the script source, used for debugging purposes.
     */
    unstable_evaluateScript(scriptSource: string, scriptSourceUrl: string): void;
}
export {};
