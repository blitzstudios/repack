import { bundle } from './bundle.js';
import { start } from './start.js';
declare const commands: readonly [{
    readonly name: "bundle";
    readonly description: "Build the bundle for the provided JavaScript entry file.";
    readonly options: ({
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
        description: string;
        parse: (val: string) => string;
        default?: undefined;
    })[];
    readonly func: typeof bundle;
}, {
    readonly name: "webpack-bundle";
    readonly description: "Build the bundle for the provided JavaScript entry file.";
    readonly options: ({
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
        description: string;
        parse: (val: string) => string;
        default?: undefined;
    })[];
    readonly func: typeof bundle;
}, {
    readonly name: "start";
    readonly description: "Start the React Native development server.";
    readonly options: ({
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
        description: string;
        parse: (val: string) => string;
        default?: undefined;
    })[];
    readonly func: typeof start;
}, {
    readonly name: "webpack-start";
    readonly description: "Start the React Native development server.";
    readonly options: ({
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
        description: string;
        parse: (val: string) => string;
        default?: undefined;
    })[];
    readonly func: typeof start;
}];
export default commands;
