import fastifyPlugin from 'fastify-plugin';

async function compilerPlugin(instance, {
  delegate
}) {
  instance.route({
    method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    url: '/*',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          platform: {
            type: 'string'
          }
        }
      }
    },
    handler: async (request, reply) => {
      var _delegate$compiler$in, _delegate$compiler;

      let file = request.params['*'];
      let {
        platform
      } = request.query;

      if (!file) {
        // This technically should never happen - this route should not be called if file is missing.
        request.log.error(`File was not provided`);
        return reply.notFound();
      } // Let consumer infer the platform. If function is not provided fallback
      // to platform query param.


      platform = ((_delegate$compiler$in = (_delegate$compiler = delegate.compiler).inferPlatform) === null || _delegate$compiler$in === void 0 ? void 0 : _delegate$compiler$in.call(_delegate$compiler, request.url)) ?? platform;

      if (!platform) {
        request.log.error('Cannot detect platform');
        return reply.badRequest('Cannot detect platform');
      } // If platform happens to be in front of an asset remove it.


      if (file.startsWith(`${platform}/`)) {
        file = file.replace(`${platform}/`, '');
      }

      const multipart = reply.asMultipart();

      const sendProgress = ({
        completed,
        total
      }) => {
        multipart === null || multipart === void 0 ? void 0 : multipart.writeChunk({
          'Content-Type': 'application/json'
        }, JSON.stringify({
          done: completed,
          total
        }));
      };

      try {
        const asset = await delegate.compiler.getAsset(file, platform, sendProgress);
        const mimeType = delegate.compiler.getMimeType(file, platform, asset);

        if (multipart) {
          const buffer = Buffer.isBuffer(asset) ? asset : Buffer.from(asset);
          multipart.setHeader('Content-Type', `${mimeType}; charset=UTF-8`);
          multipart.setHeader('Content-Length', String(Buffer.byteLength(buffer)));
          multipart.end(buffer);
        } else {
          return reply.code(200).type(mimeType).send(asset);
        }
      } catch (error) {
        request.log.error(error);
        return reply.notFound(error.message);
      }
    }
  });
}

export default fastifyPlugin(compilerPlugin, {
  name: 'compiler-plugin',
  dependencies: ['fastify-sensible', 'multipart-plugin']
});
//# sourceMappingURL=compilerPlugin.js.map