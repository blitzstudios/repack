import fastifyPlugin from 'fastify-plugin';
import { WebSocketRouter } from "./WebSocketRouter.js";
import { WebSocketServerAdapter } from "./WebSocketServerAdapter.js";
import { WebSocketApiServer } from "./servers/WebSocketApiServer.js";
import { WebSocketDevClientServer } from "./servers/WebSocketDevClientServer.js";
import { WebSocketEventsServer } from "./servers/WebSocketEventsServer.js";
import { WebSocketHMRServer } from "./servers/WebSocketHMRServer.js";
import { WebSocketMessageServer } from "./servers/WebSocketMessageServer.js";
/**
 * Defined in @react-native/dev-middleware
 * Reference: https://github.com/facebook/react-native/blob/main/packages/dev-middleware/src/inspector-proxy/InspectorProxy.js
 */
const WS_DEVICE_URL = '/inspector/device';
const WS_DEBUGGER_URL = '/inspector/debug';
async function wssPlugin(instance, {
  options,
  delegate
}) {
  const router = new WebSocketRouter(instance);
  const devClientServer = new WebSocketDevClientServer(instance);
  const messageServer = new WebSocketMessageServer(instance);
  const eventsServer = new WebSocketEventsServer(instance, {
    webSocketMessageServer: messageServer
  });
  const apiServer = new WebSocketApiServer(instance);
  const hmrServer = new WebSocketHMRServer(instance, delegate.hmr);

  // @react-native/dev-middleware servers
  const deviceConnectionServer = new WebSocketServerAdapter(instance, WS_DEVICE_URL, options.endpoints?.[WS_DEVICE_URL]);
  const debuggerConnectionServer = new WebSocketServerAdapter(instance, WS_DEBUGGER_URL, options.endpoints?.[WS_DEBUGGER_URL]);
  router.registerServer(devClientServer);
  router.registerServer(messageServer);
  router.registerServer(eventsServer);
  router.registerServer(apiServer);
  router.registerServer(hmrServer);
  router.registerServer(deviceConnectionServer);
  router.registerServer(debuggerConnectionServer);
  instance.decorate('wss', {
    devClientServer,
    messageServer,
    eventsServer,
    apiServer,
    hmrServer,
    deviceConnectionServer,
    debuggerConnectionServer,
    router
  });
}
export default fastifyPlugin(wssPlugin, {
  name: 'wss-plugin'
});
//# sourceMappingURL=wssPlugin.js.map