import fastifyPlugin from 'fastify-plugin';
import { WebSocketDebuggerServer } from "./servers/WebSocketDebuggerServer.js";
import { WebSocketDevClientServer } from "./servers/WebSocketDevClientServer.js";
import { WebSocketMessageServer } from "./servers/WebSocketMessageServer.js";
import { WebSocketEventsServer } from "./servers/WebSocketEventsServer.js";
import { HermesInspectorProxy } from "./servers/HermesInspectorProxy.js";
import { WebSocketApiServer } from "./servers/WebSocketApiServer.js";
import { WebSocketHMRServer } from "./servers/WebSocketHMRServer.js";
import { WebSocketRouter } from "./WebSocketRouter.js";

async function wssPlugin(instance, {
  options,
  delegate
}) {
  const router = new WebSocketRouter(instance);
  const debuggerServer = new WebSocketDebuggerServer(instance);
  const devClientServer = new WebSocketDevClientServer(instance);
  const messageServer = new WebSocketMessageServer(instance);
  const eventsServer = new WebSocketEventsServer(instance, {
    webSocketMessageServer: messageServer
  });
  const hermesInspectorProxy = new HermesInspectorProxy(instance, options);
  const apiServer = new WebSocketApiServer(instance);
  const hmrServer = new WebSocketHMRServer(instance, delegate.hmr);
  router.registerServer(debuggerServer);
  router.registerServer(devClientServer);
  router.registerServer(messageServer);
  router.registerServer(eventsServer);
  router.registerServer(hermesInspectorProxy);
  router.registerServer(apiServer);
  router.registerServer(hmrServer);
  instance.decorate('wss', {
    debuggerServer,
    devClientServer,
    messageServer,
    eventsServer,
    hermesInspectorProxy,
    apiServer,
    hmrServer,
    router
  });
}

export default fastifyPlugin(wssPlugin, {
  name: 'wss-plugin'
});
//# sourceMappingURL=wssPlugin.js.map