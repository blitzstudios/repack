import path from 'path';
import fastifyPlugin from 'fastify-plugin';
import { Symbolicator } from "./Symbolicator.js";

async function symbolicatePlugin(instance, {
  delegate
}) {
  const symbolicator = new Symbolicator(delegate.symbolicator);
  instance.post('/symbolicate', async (request, reply) => {
    // React Native sends stack as JSON but tests content-type to text/plain, so
    // we cannot use JSON schema to validate the body.
    try {
      var _request$query;

      let {
        stack
      } = JSON.parse(request.body);
      const platform = (_request$query = request.query) === null || _request$query === void 0 ? void 0 : _request$query.platform;

      for (let i = 0; i < stack.length; i++) {
        let file = stack[i].file;
        let bundle = path.parse(file).base; // When running in visual studio code, our bundle is copied to a local location:
        // clients/app-mobile/.vscode/.react/index.bundle.
        // In order to parse source maps we need to point to localhost instead.

        if (file.startsWith('http://')) {
          break;
        }

        if (bundle === '<anonymous>') {
          break;
        }

        stack[i].file = `http://localhost:8081/${bundle}?platform=${platform}`;
      }

      if (!platform) {
        request.log.debug({
          msg: 'Received stack',
          stack
        });
        reply.badRequest('Cannot infer platform from stack trace');
      } else {
        request.log.debug({
          msg: 'Starting symbolication',
          platform,
          stack
        });
        const results = await symbolicator.process(request.log, stack);
        reply.send(results);
      }
    } catch (error) {
      request.log.error({
        msg: 'Failed to symbolicate',
        error: error.message
      });
      reply.badRequest('Failed to symbolicate');
    }
  });
}

export default fastifyPlugin(symbolicatePlugin, {
  name: 'symbolicate-plugin',
  dependencies: ['fastify-sensible']
});
//# sourceMappingURL=sybmolicatePlugin.js.map