import { Writable } from 'stream';
import Fastify from 'fastify';
import fastifySensible from '@fastify/sensible';
import fastifyStatic from '@fastify/static';
import debuggerAppPath from '@callstack/repack-debugger-app';
import multipartPlugin from "./plugins/multipart/index.js";
import compilerPlugin from "./plugins/compiler/index.js";
import devtoolsPlugin from "./plugins/devtools/index.js";
import apiPlugin from "./plugins/api/index.js";
import wssPlugin from "./plugins/wss/index.js";
import faviconPlugin from "./plugins/favicon/index.js";
import { Internal } from "./types.js";
import symbolicatePlugin from "./plugins/symbolicate/index.js";
/**
 * Create instance of development server, powered by Fastify.
 *
 * @param config Server configuration.
 * @returns `start` and `stop` functions as well as an underlying Fastify `instance`.
 */

export async function createServer(config) {
  let delegate;
  /** Fastify instance powering the development server. */

  const instance = Fastify({
    logger: {
      level: 'trace',
      stream: new Writable({
        write: (chunk, _encoding, callback) => {
          var _delegate, _instance$wss;

          const log = JSON.parse(chunk.toString());
          (_delegate = delegate) === null || _delegate === void 0 ? void 0 : _delegate.logger.onMessage(log);
          (_instance$wss = instance.wss) === null || _instance$wss === void 0 ? void 0 : _instance$wss.apiServer.send(log);
          callback();
        }
      })
    },
    ...(config.options.https ? {
      https: config.options.https
    } : undefined)
  });
  delegate = config.delegate({
    log: instance.log,
    notifyBuildStart: platform => {
      instance.wss.apiServer.send({
        event: Internal.EventTypes.BuildStart,
        platform
      });
    },
    notifyBuildEnd: platform => {
      instance.wss.apiServer.send({
        event: Internal.EventTypes.BuildEnd,
        platform
      });
    },
    broadcastToHmrClients: (event, platform, clientIds) => {
      instance.wss.hmrServer.send(event, platform, clientIds);
    },
    broadcastToMessageClients: ({
      method,
      params
    }) => {
      instance.wss.messageServer.broadcast(method, params);
    }
  }); // Register plugins

  await instance.register(fastifySensible);
  await instance.register(wssPlugin, {
    options: config.options,
    delegate
  });
  await instance.register(multipartPlugin);
  await instance.register(apiPlugin, {
    delegate,
    prefix: '/api'
  });
  await instance.register(compilerPlugin, {
    delegate
  });
  await instance.register(symbolicatePlugin, {
    delegate
  });
  await instance.register(devtoolsPlugin, {
    options: config.options
  });
  await instance.register(fastifyStatic, {
    root: debuggerAppPath,
    prefix: '/debugger-ui',
    prefixAvoidTrailingSlash: true
  }); // below is to prevent showing `GET 400 /favicon.ico`
  // errors in console when requesting the bundle via browser

  await instance.register(faviconPlugin);
  instance.addHook('onSend', async (request, reply, payload) => {
    reply.header('X-Content-Type-Options', 'nosniff');
    const [pathname] = request.url.split('?');

    if (pathname.endsWith('.map')) {
      reply.header('Access-Control-Allow-Origin', 'devtools://devtools');
    }

    return payload;
  }); // Register routes

  instance.get('/', async () => delegate.messages.getHello());
  instance.get('/status', async () => delegate.messages.getStatus());
  /** Start the development server. */

  async function start() {
    await instance.listen({
      host: config.options.host,
      port: config.options.port
    });
  }
  /** Stop the development server. */


  async function stop() {
    await instance.close();
  }

  return {
    start,
    stop,
    instance
  };
}
//# sourceMappingURL=createServer.js.map