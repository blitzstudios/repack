export declare function getCommandConfig(command: 'start' | 'bundle'): {
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
} | {
    mode: string;
    devServer: boolean;
    optimization: {
        minimize: boolean;
    };
};
