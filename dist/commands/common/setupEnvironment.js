"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupEnvironment = setupEnvironment;
exports.setupRspackEnvironment = setupRspackEnvironment;
var _env = require("../../env.js");
function setEnvVar(key, value) {
  if (process.env[key] === undefined && value !== undefined) {
    process.env[key] = value;
  }
}
function setupEnvironment(args) {
  setEnvVar(_env.NODE_ENV_KEY, args.dev === false ? 'production' : 'development');
  setEnvVar(_env.VERBOSE_ENV_KEY, args.verbose ? 'true' : undefined);
  setEnvVar(_env.BUNDLE_FILENAME_ENV_KEY, args.bundleOutput);
  setEnvVar(_env.SOURCEMAP_FILENAME_ENV_KEY, args.sourcemapOutput);
  setEnvVar(_env.ASSETS_DEST_ENV_KEY, args.assetsDest);
}
function setupRspackEnvironment(maxWorkers) {
  setEnvVar(_env.RSPACK_TOKIO_THREADS_ENV_KEY, maxWorkers);
  setEnvVar(_env.RSPACK_RAYON_THREADS_ENV_KEY, maxWorkers);
}