/* globals __DEV__, __repack__, Headers, FormData */
import EventEmitter from 'events';
import shallowEqual from 'shallowequal';
import { LoadEvent } from '../shared/LoadEvent';
import { Chunk } from './Chunk';
const CACHE_KEY = `Repack.ChunkManager.Cache.v2.${__DEV__ ? 'debug' : 'release'}`;
export const DEFAULT_TIMEOUT = 30000; // 30s

export class ChunkManagerBackend {
  forceRemoteChunkResolution = false;
  eventEmitter = new EventEmitter();

  constructor(nativeModule) {
    this.nativeModule = nativeModule;
  }

  configure(config) {
    var _config$forceRemoteCh;

    this.storage = config.storage;
    this.forceRemoteChunkResolution = (_config$forceRemoteCh = config.forceRemoteChunkResolution) !== null && _config$forceRemoteCh !== void 0 ? _config$forceRemoteCh : false;
    this.resolveRemoteChunk = config.resolveRemoteChunk;

    __repack__.loadChunkCallback.push = ((parentPush, ...data) => {
      this.eventEmitter.emit('loaded', data[0]);
      return parentPush(...data);
    }).bind(null, __repack__.loadChunkCallback.push.bind(__repack__.loadChunkCallback));
  }

  async initCache() {
    if (!this.cache) {
      var _await$this$storage$g, _this$storage;

      const cache = JSON.parse((_await$this$storage$g = await ((_this$storage = this.storage) === null || _this$storage === void 0 ? void 0 : _this$storage.getItem(CACHE_KEY))) !== null && _await$this$storage$g !== void 0 ? _await$this$storage$g : '{}');
      this.cache = cache !== null && cache !== void 0 ? cache : undefined;
    }
  }

  async saveCache() {
    var _this$storage2;

    await ((_this$storage2 = this.storage) === null || _this$storage2 === void 0 ? void 0 : _this$storage2.setItem(CACHE_KEY, JSON.stringify(this.cache)));
  }

  async resolveChunk(chunkId, parentChunkId) {
    var _global$__CHUNKS__, _global$__CHUNKS__$lo;

    await this.initCache();
    let method = 'GET';
    let url;
    let fetch = false;
    let absolute = false;
    let query;
    let body;
    let headers;
    let timeout = DEFAULT_TIMEOUT;

    if (__DEV__ && !this.forceRemoteChunkResolution) {
      url = Chunk.fromDevServer(chunkId);
      fetch = true;
    } else if ((_global$__CHUNKS__ = global.__CHUNKS__) !== null && _global$__CHUNKS__ !== void 0 && (_global$__CHUNKS__$lo = _global$__CHUNKS__['local']) !== null && _global$__CHUNKS__$lo !== void 0 && _global$__CHUNKS__$lo.includes(chunkId) && !this.forceRemoteChunkResolution) {
      url = Chunk.fromFileSystem(chunkId);
    } else {
      var _config$absolute, _config$timeout, _config$method;

      if (!this.resolveRemoteChunk) {
        throw new Error('No remote chunk resolver was provided. Did you forget to add `ChunkManager.configure({ resolveRemoteChunk: ... })`?');
      }

      const config = await this.resolveRemoteChunk(chunkId, parentChunkId);
      absolute = (_config$absolute = config.absolute) !== null && _config$absolute !== void 0 ? _config$absolute : absolute;
      timeout = (_config$timeout = config.timeout) !== null && _config$timeout !== void 0 ? _config$timeout : timeout;
      method = (_config$method = config.method) !== null && _config$method !== void 0 ? _config$method : method;
      url = Chunk.fromRemote(config.url, {
        excludeExtension: config.excludeExtension
      });

      if (config.query instanceof URLSearchParams) {
        query = config.query.toString();
      } else if (typeof config.query === 'string') {
        query = config.query;
      } else if (config.query) {
        query = Object.entries(config.query).reduce((acc, [key, value]) => [...acc, `${key}=${value}`], []).join('&');
      }

      if (config.headers instanceof Headers) {
        config.headers.forEach((value, key) => {
          var _headers;

          headers = (_headers = headers) !== null && _headers !== void 0 ? _headers : {};
          headers[key.toLowerCase()] = value;
        });
      } else if (config.headers) {
        headers = Object.entries(config.headers).reduce((acc, [key, value]) => ({ ...acc,
          [key.toLowerCase()]: value
        }), {});
      }

      if (config.body instanceof FormData) {
        const tempBody = {};
        config.body.forEach((value, key) => {
          if (typeof value === 'string') {
            tempBody[key] = value;
          } else {
            console.warn('ChunkManager.resolveChunk does not support File as FormData key in body');
          }
        });
        body = JSON.stringify(tempBody);
      } else if (config.body instanceof URLSearchParams) {
        const tempBody = {};
        config.body.forEach((value, key) => {
          tempBody[key] = value;
        });
        body = JSON.stringify(tempBody);
      } else {
        var _config$body;

        body = (_config$body = config.body) !== null && _config$body !== void 0 ? _config$body : undefined;
      }
    }

    if (!this.cache[chunkId] || this.cache[chunkId].url !== url || this.cache[chunkId].query !== query || !shallowEqual(this.cache[chunkId].headers, headers) || this.cache[chunkId].body !== body) {
      fetch = true;
      this.cache[chunkId] = {
        url,
        method,
        query,
        body,
        headers,
        timeout,
        absolute
      };
      await this.saveCache();
    }

    return { ...this.cache[chunkId],
      fetch
    };
  }

  async loadChunk(chunkId, parentChunkId) {
    let config;

    try {
      config = await this.resolveChunk(chunkId, parentChunkId);
    } catch (error) {
      console.error('ChunkManager.resolveChunk error:', error.message);
      throw new LoadEvent('resolution', chunkId, error);
    }

    try {
      const loadedPromise = new Promise(resolve => {
        this.eventEmitter.once('loaded', data => {
          if (data === chunkId) {
            resolve();
          }
        });
      });
      await this.nativeModule.loadChunk(chunkId, config);
      await loadedPromise;
    } catch (error) {
      const {
        message,
        code
      } = error;
      console.error('ChunkManager.loadChunk invocation failed:', message, code ? `[${code}]` : '', config);
      throw new LoadEvent('load', config.url, error);
    }
  }

  async preloadChunk(chunkId, parentChunkId) {
    let config;

    try {
      config = await this.resolveChunk(chunkId, parentChunkId);
    } catch (error) {
      console.error('ChunkManager.resolveChunk error:', error.message);
      throw new LoadEvent('resolution', chunkId, error);
    }

    try {
      await this.nativeModule.preloadChunk(chunkId, config);
    } catch (error) {
      const {
        message,
        code
      } = error;
      console.error('ChunkManager.preloadChunk invocation failed:', message, code ? `[${code}]` : '', config);
      throw new LoadEvent('load', config.url, error);
    }
  }

  async invalidateChunks(chunksIds = []) {
    try {
      await this.initCache();
      const ids = chunksIds !== null && chunksIds !== void 0 ? chunksIds : Object.keys(this.cache.urls);

      for (const chunkId of ids) {
        delete this.cache[chunkId];
      }

      await this.saveCache();
      await this.nativeModule.invalidateChunks(ids);
    } catch (error) {
      const {
        message,
        code
      } = error;
      console.error('ChunkManager.invalidateChunks invocation failed:', message, code ? `[${code}]` : '');
      throw error;
    }
  }

}
//# sourceMappingURL=ChunkManagerBackend.js.map