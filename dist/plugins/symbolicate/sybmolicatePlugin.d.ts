import type { FastifyInstance } from 'fastify';
import type { Server } from '../../types';
declare function symbolicatePlugin(instance: FastifyInstance, { delegate, }: {
    delegate: Server.Delegate;
}): Promise<void>;
declare const _default: typeof symbolicatePlugin;
export default _default;
