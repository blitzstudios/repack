export declare function getRepackConfig(bundler: 'rspack' | 'webpack', rootDir: string): Promise<{
    devtool: string;
    experiments: {
        parallelLoader: boolean;
    } | undefined;
    output: {
        clean: boolean;
        hashFunction: string;
        filename: string;
        chunkFilename: string;
        path: string;
        publicPath: string;
    };
    optimization: {
        chunkIds: string;
        minimizer: any[];
    };
}>;
