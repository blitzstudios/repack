export declare class LoadEvent {
    type: string;
    error?: any;
    target: {
        src: string;
    };
    constructor(type: string, src: string, error?: any);
}
