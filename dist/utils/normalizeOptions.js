function normalizeHttpsOptions(serverOptions) {
    if (serverOptions &&
        typeof serverOptions === 'object' &&
        serverOptions.type === 'https') {
        return serverOptions.options;
    }
    return undefined;
}
function normalizeProxyOptions(proxyOptions, fallbackTarget) {
    if (proxyOptions) {
        return proxyOptions.map((options) => {
            const { context, path, pathFilter, target, ...rest } = options;
            return {
                ...rest,
                // webpack dev server compatible aliases for pathFilter
                pathFilter: pathFilter ?? context ?? path,
                // assume that if the target is not provided, we target our own DevServer
                target: target ?? fallbackTarget,
            };
        });
    }
    return undefined;
}
function normalizeSetupMiddlewares(setupMiddlewares) {
    // create a passthrough function if no setupMiddlewares is provided
    return setupMiddlewares ?? ((middlewares) => middlewares);
}
export function normalizeOptions(options) {
    const host = options.host ?? 'localhost';
    const port = options.port ?? 8081;
    const https = normalizeHttpsOptions(options.server);
    const hot = options.hot ?? false;
    const protocol = https ? 'https' : 'http';
    const url = `${protocol}://${host}:${options.port}`;
    const proxy = normalizeProxyOptions(options.proxy, url);
    const setupMiddlewares = normalizeSetupMiddlewares(options.setupMiddlewares);
    return {
        // webpack dev server compatible options
        host,
        port,
        https,
        hot,
        proxy,
        url,
        // dev middleware
        devMiddleware: options.devMiddleware,
        // fastify options
        disableRequestLogging: !options.logRequests,
        // project options
        rootDir: options.rootDir,
        // custom middleware setup
        setupMiddlewares,
    };
}
