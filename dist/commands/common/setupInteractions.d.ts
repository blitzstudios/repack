import nodeReadline from 'node:readline';
import type { Logger } from '../../types';
export declare function setupInteractions(handlers: {
    onReload?: () => void;
    onOpenDevMenu?: () => void;
    onOpenDevTools?: () => void;
}, options?: {
    logger?: Logger;
    process?: NodeJS.Process;
    readline?: typeof nodeReadline;
}): void;
