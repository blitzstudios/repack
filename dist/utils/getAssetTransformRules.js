"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAssetTransformRules = getAssetTransformRules;
var _assetExtensions = require("./assetExtensions.js");
function getSvgRule(type) {
  const isTypeObject = typeof type === 'object';
  if (type === 'svgr' || isTypeObject && type?.type === 'svgr') {
    const additionalOptions = isTypeObject && type?.options;
    return {
      test: /\.svg$/,
      use: {
        loader: '@svgr/webpack',
        options: {
          native: true,
          ...additionalOptions
        }
      }
    };
  }
  return {
    test: /\.svg$/,
    type: type === 'xml' ? 'asset/source' : 'asset/inline'
  };
}

/**
 * Interface for {@link getAssetTransformRules} options.
 */

/**
 * Creates `module.rules` configuration for handling assets in React Native applications.
 *
 * @param options Configuration options
 * @param options.inline Whether to inline assets as base64 URIs (defaults to false)
 * @param options.remote Configuration for remote asset loading with publicPath and optional assetPath function
 * @param options.svg Determines how SVG files should be processed ('svgr', 'xml', or 'uri')
 *
 * @returns Array of webpack/rspack rules for transforming assets
 */
function getAssetTransformRules({
  inline,
  remote,
  svg
} = {}) {
  const extensions = svg ? _assetExtensions.ASSET_EXTENSIONS.filter(ext => ext !== 'svg') : _assetExtensions.ASSET_EXTENSIONS;
  const remoteOptions = remote ? {
    enabled: true,
    ...remote
  } : undefined;
  const rules = [];
  rules.push({
    test: (0, _assetExtensions.getAssetExtensionsRegExp)(extensions),
    use: {
      loader: '@callstack/repack/assets-loader',
      options: {
        inline,
        remote: remoteOptions
      }
    }
  });
  if (svg) {
    rules.push(getSvgRule(svg));
  }
  return rules;
}
//# sourceMappingURL=getAssetTransformRules.js.map