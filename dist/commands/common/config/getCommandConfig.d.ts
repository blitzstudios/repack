export declare function getCommandConfig(command: 'start' | 'bundle', bundler: 'rspack' | 'webpack'): {
    mode: string;
    devServer: {
        host: string;
        port: number;
        hot: boolean;
        server: string;
    };
    output: {
        publicPath: string;
    };
    cache: boolean;
    experiments: {
        cache: {
            type: string;
        };
    };
} | {
    mode: string;
    devServer: {
        host: string;
        port: number;
        hot: boolean;
        server: string;
    };
    output: {
        publicPath: string;
    };
    cache: {
        type: string;
    };
    experiments?: undefined;
} | {
    mode: string;
    devServer: {
        host: string;
        port: number;
        hot: boolean;
        server: string;
    };
    output: {
        publicPath: string;
    };
    cache?: undefined;
    experiments?: undefined;
} | {
    mode: string;
    devServer: boolean;
    optimization: {
        minimize: boolean;
    };
};
