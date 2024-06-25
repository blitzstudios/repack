import type { FastifyInstance } from 'fastify';
import type { Server } from '../../types';
declare function compilerPlugin(instance: FastifyInstance, { delegate }: {
    delegate: Server.Delegate;
}): Promise<void>;
declare const _default: typeof compilerPlugin;
export default _default;
