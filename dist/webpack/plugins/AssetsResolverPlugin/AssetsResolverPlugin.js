"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssetsResolverPlugin = void 0;

var _assetExtensions = require("../../utils/assetExtensions");

var _AssetResolver = require("./AssetResolver");

/**
 * Plugin for resolving assets (images, audio, video etc) for React Native applications.
 *
 * Assets processing in React Native differs from Web, Node.js or other targets.
 * This plugin in combination with `@callstack/repack/assets-loader` allows
 * you to use assets in the same way as you would do when using Metro.
 *
 * @category Webpack Plugin
 */
class AssetsResolverPlugin {
  /**
   * Constructs new `AssetsResolverPlugin`.
   *
   * @param config Plugin configuration options.
   */
  constructor(config) {
    var _this$config$extensio, _this$config$scalable;

    this.config = config;
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
    compiler.options.resolve.plugins = (compiler.options.resolve.plugins || []).concat(assetResolver);
  }

}

exports.AssetsResolverPlugin = AssetsResolverPlugin;
//# sourceMappingURL=AssetsResolverPlugin.js.map