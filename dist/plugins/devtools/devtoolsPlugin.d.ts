import type { FastifyInstance } from 'fastify';
import type { Server } from '../../types';
declare function devtoolsPlugin(instance: FastifyInstance, { options }: {
    options: Server.Options;
}): Promise<void>;
declare const _default: typeof devtoolsPlugin;
export default _default;
