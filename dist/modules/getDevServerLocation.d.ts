declare const location: {
    host: string;
    hostname: string;
    href: string;
    origin: string;
    pathname: string;
    port: number;
    protocol: string;
};
type DevServerLocation = typeof location;
export declare function getDevServerLocation(): DevServerLocation;
export {};
