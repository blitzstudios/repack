import type { Logger } from '../../types.js';
export declare function normalizeStatsOptions<Stats>(options: Stats, preset?: string): Stats;
interface WriteStatsOptions {
    filepath: string;
    logger?: Logger;
    rootDir: string;
}
export declare function writeStats(stats: any, { filepath, logger, rootDir }: WriteStatsOptions): Promise<void>;
export {};
