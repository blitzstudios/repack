export declare const startCommandOptions: ({
    name: string;
    description: string;
    parse: (val: string) => number;
    default?: undefined;
} | {
    name: string;
    description: string;
    default: string;
    parse?: undefined;
} | {
    name: string;
    description: string;
    parse?: undefined;
    default?: undefined;
} | {
    name: string;
    description?: undefined;
    parse?: undefined;
    default?: undefined;
} | {
    name: string;
    description: string;
    parse: (val: string) => string;
    default?: undefined;
})[];
export declare const bundleCommandOptions: ({
    name: string;
    description: string;
    default?: undefined;
    parse?: undefined;
} | {
    name: string;
    description: string;
    default: string;
    parse?: undefined;
} | {
    name: string;
    description: string;
    parse: (val: string) => boolean;
    default: boolean;
} | {
    name: string;
    description: string;
    parse: (val: string) => boolean;
    default?: undefined;
} | {
    name: string;
    description?: undefined;
    default?: undefined;
    parse?: undefined;
} | {
    name: string;
    description: string;
    parse: (val: string) => string;
    default?: undefined;
})[];
