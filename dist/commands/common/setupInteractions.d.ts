import defaultReadline from 'node:readline';
import type { Logger } from '../../types';
export declare function setupInteractions(handlers: {
    onReload?: () => void;
    onOpenDevMenu?: () => void;
    onOpenDevTools?: () => void;
}, logger?: Logger, process?: NodeJS.Process, readline?: typeof defaultReadline): void;
