export declare function getRepackConfig(): {
    devtool: string;
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
    };
};
