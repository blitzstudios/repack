import { openStackFrameInEditorMiddleware, openURLMiddleware } from '@react-native-community/cli-server-api';
import fastifyPlugin from 'fastify-plugin';
async function devtoolsPlugin(instance, {
  options
}) {
  instance.use('/open-url', openURLMiddleware);
  instance.use('/open-stack-frame', openStackFrameInEditorMiddleware({
    watchFolders: [options.rootDir]
  }));
  instance.route({
    method: ['GET', 'POST', 'PUT'],
    url: '/reload',
    handler: (_request, reply) => {
      instance.wss.messageServer.broadcast('reload');
      reply.send('OK');
    }
  });
}
export default fastifyPlugin(devtoolsPlugin, {
  name: 'devtools-plugin',
  dependencies: ['wss-plugin']
});
//# sourceMappingURL=devtoolsPlugin.js.map