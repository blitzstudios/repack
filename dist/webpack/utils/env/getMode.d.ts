import { Fallback } from '../../../types';
export declare type Mode = 'production' | 'development';
export declare function getMode(options?: Fallback<Mode>): Mode;
