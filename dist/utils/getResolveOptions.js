"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getResolveOptions = getResolveOptions;
var _assetExtensions = require("./assetExtensions");
/**
 * {@link getResolveOptions} additional options.
 */

/**
 * Get Webpack's resolve options to properly resolve JavaScript files:
 * - resolve platform extensions (e.g. `file.ios.js`)
 * - resolve native extensions (e.g. `file.native.js`)
 * - optionally use package exports (`exports` field in `package.json`) instead of
 *   main fields (e.g. `main` or `browser` or `react-native`)
 *
 * @param platform Target application platform.
 * @param options Additional options that can modify resolution behaviour.
 * @returns Webpack's resolve options.
 *
 * @category Webpack util
 *
 * @example Usage in Webpack config:
 *
 * ```ts
 * import * as Repack from '@callstack/repack';
 *
 * export default (env) => {
 *   const { platform } = env;
 *
 *   return {
 *     resolve: {
 *       ...Repack.getResolveOptions(platform, {
 *         enablePackageExports: false,
 *         preferNativePlatform: true
 *       }),
 *     },
 *   };
 * };
 * ```
 */

function getResolveOptions(platform, options) {
  const preferNativePlatform = options?.preferNativePlatform ?? true;
  const enablePackageExports = options?.enablePackageExports ?? false;
  let extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];
  let conditionNames;
  let exportsFields;
  if (enablePackageExports) {
    /**
     * Match what React Native uses in @react-native/metro-config.
     * Order of conditionNames doesn't matter.
     * Order inside of target package.json's `exports` field matters.
     */
    conditionNames = ['require', 'import', 'react-native'];
    exportsFields = ['exports'];
  } else {
    conditionNames = [];
    exportsFields = [];
    extensions = extensions.flatMap(ext => {
      const platformExt = `.${platform}${ext}`;
      const nativeExt = `.native${ext}`;
      if (preferNativePlatform) {
        return [platformExt, nativeExt, ext];
      }
      return [platformExt, ext];
    });
  }

  /**
   * Disable importsFields completely since it's not supported by metro at all.
   */
  const importsFields = [];

  /**
   * Match what React Native uses from metro-config.
   * Usage of 'extensionAlias' removes the need for
   * AssetResolverPlugin altogether.
   */
  const extensionAlias = Object.fromEntries(_assetExtensions.SCALABLE_ASSETS.map(assetExt => {
    const ext = '.' + assetExt;
    const aliases = _assetExtensions.SCALABLE_RESOLUTIONS.map(scale => {
      return '@' + scale + 'x' + ext;
    });
    return [ext, aliases.concat(ext)];
  }));

  /**
   * Match what React Native uses in @react-native/metro-config.
   * First entry takes precedence.
   *
   * Reference: https://github.com/facebook/react-native/blob/main/packages/metro-config/src/index.flow.js
   */
  return {
    /**
     * Reference: Webpack's [configuration.resolve.mainFields](https://webpack.js.org/configuration/resolve/#resolvemainfields)
     */
    mainFields: ['react-native', 'browser', 'main'],
    /**
     * Reference: Webpack's [configuration.resolve.aliasFields](https://webpack.js.org/configuration/resolve/#resolvealiasfields)
     */
    aliasFields: ['react-native', 'browser', 'main'],
    /**
     * Reference: Webpack's [configuration.resolve.conditionNames](https://webpack.js.org/configuration/resolve/#resolveconditionnames)
     */
    conditionNames: conditionNames,
    /**
     * Reference: Webpack's [configuration.resolve.exportsFields](https://webpack.js.org/configuration/resolve/#resolveexportsfields)
     */
    exportsFields: exportsFields,
    /**
     * Reference: Webpack's [configuration.resolve.extensions](https://webpack.js.org/configuration/resolve/#resolveextensions)
     */
    extensions: extensions,
    /**
     * Reference: Webpack's [configuration.resolve.extensionAlias](https://webpack.js.org/configuration/resolve/#resolveextensionalias)
     */
    extensionAlias: extensionAlias,
    /**
     * Reference: Webpack's [configuration.resolve.importsFields](https://webpack.js.org/configuration/resolve/#resolveimportsfields)
     */
    importsFields: importsFields
  };
}
//# sourceMappingURL=getResolveOptions.js.map