"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssetResolver = void 0;

var _path = _interopRequireDefault(require("path"));

var _escapeStringRegexp = _interopRequireDefault(require("escape-string-regexp"));

var _assetExtensions = require("../../utils/assetExtensions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AssetResolver {
  static collectScales(scalableAssetExtensions, files, {
    name,
    type,
    platform
  }) {
    const regex = scalableAssetExtensions.includes(type) ? new RegExp(`^${(0, _escapeStringRegexp.default)(name)}(@\\d+(\\.\\d+)?x)?(\\.(${platform}|native))?.${(0, _escapeStringRegexp.default)(type)}$`) : new RegExp(`^${(0, _escapeStringRegexp.default)(name)}(\\.(${platform}|native))?\\.${type}$`);

    const priority = queryPlatform => ['native', platform].indexOf(queryPlatform); // Build a map of files according to the scale


    const output = {};

    for (const file of files) {
      const match = regex.exec(file);

      if (match) {
        let [, scale,,, platform] = match;
        scale = scale || '@1x';

        if (!output[scale] || priority(platform) > priority(output[scale].platform)) {
          output[scale] = {
            platform,
            name: file
          };
        }
      }
    }

    return output;
  }

  constructor(config, compiler) {
    this.config = config;
    this.compiler = compiler;
  }

  apply(resolver) {
    const platform = this.config.platform;
    const test = (0, _assetExtensions.getAssetExtensionsRegExp)(this.config.extensions);
    const logger = this.compiler.getInfrastructureLogger('RepackAssetResolver');
    resolver.getHook('file').tapAsync('RepackAssetResolver', (request, _context, callback) => {
      const requestPath = request.path;

      if (typeof requestPath === 'string' && !test.test(requestPath) || requestPath === false) {
        callback();
        return;
      }

      logger.debug('Processing asset:', requestPath);
      resolver.fileSystem.readdir(_path.default.dirname(requestPath), (error, results) => {
        if (error) {
          callback();
          return;
        }

        const basename = _path.default.basename(requestPath);

        const name = basename.replace(/\.[^.]+$/, '');

        const type = _path.default.extname(requestPath).substring(1);

        const files = (results === null || results === void 0 ? void 0 : results.filter(result => typeof result === 'string')) ?? [];
        let resolved = files.includes(basename) ? requestPath : undefined;

        if (!resolved) {
          var _map$key;

          const map = AssetResolver.collectScales(this.config.scalableExtensions, files, {
            name,
            type,
            platform
          });
          const key = map['@1x'] ? '@1x' : Object.keys(map).sort((a, b) => Number(a.replace(/[^\d.]/g, '')) - Number(b.replace(/[^\d.]/g, '')))[0];
          resolved = (_map$key = map[key]) !== null && _map$key !== void 0 && _map$key.name ? _path.default.resolve(_path.default.dirname(requestPath), map[key].name) : undefined;

          if (!resolved) {
            logger.error('Cannot resolve:', requestPath, {
              files,
              scales: map
            });
            callback();
            return;
          }
        }

        const resolvedFile = { ...request,
          path: resolved,
          relativePath: request.relativePath && resolver.join(request.relativePath, resolved),
          file: true
        };
        logger.debug('Asset resolved:', requestPath, '->', resolved);
        callback(null, resolvedFile);
      });
    });
  }

}

exports.AssetResolver = AssetResolver;
//# sourceMappingURL=AssetResolver.js.map