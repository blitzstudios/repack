import path from 'path';
import fastifyPlugin from 'fastify-plugin';
import { Symbolicator } from './Symbolicator.js';
function getStackFromRequestBody(request) {
    let body;
    if (request.headers['content-type'] === 'application/json') {
        // RN >= 0.79 uses application/json
        body = request.body;
    }
    else {
        // RN < 0.79 uses text/plain
        body = JSON.parse(request.body);
    }
    return body.stack;
}
async function symbolicatePlugin(instance, { delegate, }) {
    const symbolicator = new Symbolicator(delegate.symbolicator);
    instance.post('/symbolicate', async (request, reply) => {
        try {
            const stack = getStackFromRequestBody(request);
            const platform = request.query
                ?.platform;
            for (let i = 0; i < stack.length; i++) {
                const file = stack[i].file;
                const bundle = path.parse(file).base;
                // When running in visual studio code, our bundle is copied to a local location:
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
                request.log.debug({ msg: 'Received stack', stack });
                reply.badRequest('Cannot infer platform from stack trace');
            }
            else {
                request.log.debug({ msg: 'Starting symbolication', platform, stack });
                const results = await symbolicator.process(request.log, stack);
                reply.send(results);
            }
        }
        catch (error) {
            request.log.error({
                msg: 'Failed to symbolicate',
                error: error.message,
            });
            reply.badRequest('Failed to symbolicate');
        }
    });
}
export default fastifyPlugin(symbolicatePlugin, {
    name: 'symbolicate-plugin',
    dependencies: ['@fastify/sensible'],
});
