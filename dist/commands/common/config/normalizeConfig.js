"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeConfig = normalizeConfig;
var _webpackMerge = require("webpack-merge");
function normalizeDevServerHost(host) {
  switch (host) {
    case 'local-ip':
      return 'localhost';
    case 'local-ipv4':
      return '127.0.0.1';
    case 'local-ipv6':
      return '::1';
    default:
      return host;
  }
}
function normalizeOutputPath(outputPath, context, platform) {
  return outputPath.replaceAll('[context]', context).replaceAll('[platform]', platform);
}
function normalizePublicPath(publicPath, platform, host, port) {
  /* set public path to noop if it's using the deprecated `getPublicPath` function */
  if (publicPath === 'DEPRECATED_GET_PUBLIC_PATH') {
    return 'noop:///';
  }
  if (publicPath === 'DEV_SERVER_PUBLIC_PATH') {
    return `http://${host}:${port}/${platform}/`;
  }
  return publicPath.replaceAll('[platform]', platform);
}
function normalizeResolveExtensions(extensions, platform) {
  return extensions.map(ext => ext.replaceAll('[platform]', platform));
}
function normalizeConfig(config, platform) {
  const normalizedConfig = {};

  /* normalize compiler name to be equal to platform */
  normalizedConfig.name = platform;

  /* normalize dev server host by resolving special values */
  if (config.devServer) {
    normalizedConfig.devServer = {
      ...normalizedConfig.devServer,
      host: normalizeDevServerHost(config.devServer.host)
    };
  }

  /* normalize output path by resolving [platform] & [context] placeholders */
  if (config.output?.path) {
    normalizedConfig.output = {
      ...normalizedConfig.output,
      path: normalizeOutputPath(config.output.path, config.context ?? process.cwd(), platform)
    };
  }

  /* normalize public path by resolving [platform] placeholder */
  if (config.output?.publicPath) {
    normalizedConfig.output = {
      ...normalizedConfig.output,
      publicPath: normalizePublicPath(config.output.publicPath, platform, normalizedConfig.devServer?.host ?? config.devServer?.host, normalizedConfig.devServer?.port ?? config.devServer?.port)
    };
  }

  /* normalize resolve extensions by resolving [platform] placeholder */
  if (config.resolve?.extensions) {
    normalizedConfig.resolve = {
      ...normalizedConfig.resolve,
      extensions: normalizeResolveExtensions(config.resolve.extensions, platform)
    };
  }

  /* return the normalized config object */
  return (0, _webpackMerge.mergeWithCustomize)({
    customizeArray: (0, _webpackMerge.customizeArray)({
      'resolve.extensions': 'replace'
    })
  })(config, normalizedConfig);
}
//# sourceMappingURL=normalizeConfig.js.map