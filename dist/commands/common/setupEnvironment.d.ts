interface EnvironmentArgs {
    assetsDest?: string;
    bundleOutput?: string;
    sourcemapOutput?: string;
    dev?: boolean;
    verbose?: boolean;
}
export declare function setupEnvironment(args: EnvironmentArgs): void;
export declare function setupRspackEnvironment(maxWorkers: string): void;
export {};
