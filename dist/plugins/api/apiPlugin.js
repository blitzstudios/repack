const paramsSchema = {
  type: 'object',
  properties: {
    platform: {
      type: 'string'
    }
  },
  required: ['platform']
};

async function apiPlugin(instance, {
  delegate
}) {
  instance.get('/platforms', async (_request, reply) => delegate.api ? reply.send({
    data: await delegate.api.getPlatforms()
  }) : reply.notImplemented('Missing API delegate implementation'));
  instance.get('/:platform/assets', {
    schema: {
      params: paramsSchema
    }
  }, async (request, reply) => delegate.api ? reply.send({
    data: await delegate.api.getAssets(request.params.platform)
  }) : reply.notImplemented('Missing API delegate implementation'));
  instance.get('/:platform/stats', {
    schema: {
      params: paramsSchema
    }
  }, async (request, reply) => {
    var _delegate$api;

    return delegate.api ? reply.send({
      data: await ((_delegate$api = delegate.api) === null || _delegate$api === void 0 ? void 0 : _delegate$api.getCompilationStats(request.params.platform))
    }) : reply.notImplemented('Missing API delegate implementation');
  });
}

export default apiPlugin;
//# sourceMappingURL=apiPlugin.js.map