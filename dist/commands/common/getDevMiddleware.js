"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDevMiddleware = getDevMiddleware;
async function getDevMiddleware(reactNativePath) {
  const reactNativeCommunityCliPluginPath = require.resolve('@react-native/community-cli-plugin', {
    paths: [reactNativePath]
  });
  const devMiddlewarePath = require.resolve('@react-native/dev-middleware', {
    paths: [reactNativeCommunityCliPluginPath]
  });
  return import(devMiddlewarePath);
}