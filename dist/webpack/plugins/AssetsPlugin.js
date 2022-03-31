"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssetsPlugin = void 0;

var _assetExtensions = require("../utils/assetExtensions");

var _AssetResolver = require("./AssetsResolverPlugin/AssetResolver");

/**
 * Plugin for loading and processing assets (images, audio, video etc) for
 * React Native applications.
 *
 * Assets processing in React Native differs from Web, Node.js or other targets. This plugin allows
 * you to use assets in the same way as you would do when using Metro.
 *
 * @deprecated Use dedicated rule with `@callstack/repack/assets-loader` and `AssetsResolverPlugin`.
 * More information can be found here: https://github.com/callstack/repack/pull/81
 *
 * @category Webpack Plugin
 */
class AssetsPlugin {
  /**
   * Constructs new `AssetsPlugin`.
   *
   * @param config Plugin configuration options.
   */
  constructor(config) {
    var _this$config$configur, _this$config$extensio, _this$config$scalable;

    this.config = config;
    this.config.configureLoader = (_this$config$configur = this.config.configureLoader) !== null && _this$config$configur !== void 0 ? _this$config$configur : true;
    this.config.extensions = (_this$config$extensio = this.config.extensions) !== null && _this$config$extensio !== void 0 ? _this$config$extensio : _assetExtensions.ASSET_EXTENSIONS;
    this.config.scalableExtensions = (_this$config$scalable = this.config.scalableExtensions) !== null && _this$config$scalable !== void 0 ? _this$config$scalable : _assetExtensions.SCALABLE_ASSETS;
  }
  /**
   * Apply the plugin.
   *
   * @param compiler Webpack compiler instance.
   */


  apply(compiler) {
    const assetResolver = new _AssetResolver.AssetResolver(this.config, compiler);

    if (this.config.configureLoader) {
      compiler.options.module.rules.push({
        test: (0, _assetExtensions.getAssetExtensionsRegExp)(assetResolver.config.extensions),
        use: [{
          loader: require.resolve('../../../assets-loader.js'),
          options: {
            platform: this.config.platform,
            scalableAssetExtensions: _assetExtensions.SCALABLE_ASSETS,
            devServerEnabled: this.config.devServerEnabled
          }
        }]
      });
    }

    compiler.options.resolve.plugins = (compiler.options.resolve.plugins || []).concat(assetResolver);
  }

}

exports.AssetsPlugin = AssetsPlugin;
//# sourceMappingURL=AssetsPlugin.js.map