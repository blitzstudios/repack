export declare function setup(): void;
export declare function enable(): void;
export declare function disable(): void;
export declare function registerBundle(): void;
export declare function log(level: string, data: any[]): void;
export declare function unstable_notifyFuseboxConsoleEnabled(): void;
declare const _default: {
    setup: typeof setup;
    enable: typeof enable;
    disable: typeof disable;
    registerBundle: typeof registerBundle;
    log: typeof log;
    unstable_notifyFuseboxConsoleEnabled: typeof unstable_notifyFuseboxConsoleEnabled;
};
export default _default;
