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

      console.log('[CompilerPlugin] compile:', request === null || request === void 0 ? void 0 : request.url);
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

      if (!platform || platform !== 'ios' && platform !== 'android') {
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
        const buffer = Buffer.isBuffer(asset) ? asset : Buffer.from(asset);

        if (multipart) {
          multipart.setHeader('Content-Type', `${mimeType}; charset=UTF-8`);
          multipart.setHeader('Content-Length', String(Buffer.byteLength(buffer)));
        } else {
          reply.header('Content-Type', `${mimeType}; charset=UTF-8`);
          reply.header('Content-Length', String(Buffer.byteLength(buffer)));
        }

        if (request.headers.range) {
          // Parse the range header to get the start and end bytes
          const parts = request.headers.range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : buffer.length - 1; // Create a new buffer that only includes the part of the file requested

          const chunk = buffer.slice(start, end + 1); // Set the necessary headers

          reply.header('Content-Range', `bytes ${start}-${end}/${buffer.length}`);
          reply.header('Accept-Ranges', 'bytes');

          if (multipart) {
            multipart.setHeader('Content-Length', String(chunk.length));
            multipart.end(chunk);
          } else {
            // Send the chunk with a 206 status code
            return reply.code(206).send(chunk);
          }
        } else {
          // If no range header is present, send the whole file like before
          if (multipart) {
            multipart.end(buffer);
          } else {
            return reply.code(200).send(asset);
          }
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