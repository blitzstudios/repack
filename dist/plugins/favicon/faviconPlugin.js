import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyFavicon from 'fastify-favicon';
import fastifyPlugin from 'fastify-plugin';

// @ts-ignore
const dirname = path.dirname(fileURLToPath(import.meta.url));
const pathToImgDir = path.join(dirname, '../../img');
async function faviconPlugin(instance) {
  instance.register(fastifyFavicon, {
    path: pathToImgDir
  });
}
export default fastifyPlugin(faviconPlugin, {
  name: 'favicon-plugin'
});
//# sourceMappingURL=faviconPlugin.js.map