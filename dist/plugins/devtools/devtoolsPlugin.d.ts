import type { FastifyInstance } from 'fastify';
import type { Server } from '../../types.js';
declare function devtoolsPlugin(instance: FastifyInstance, { delegate }: {
    delegate: Server.Delegate;
}): Promise<void>;
declare const _default: typeof devtoolsPlugin;
export default _default;
