"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupEnvironment = setupEnvironment;
var _env = require("../../env.js");
function setEnvVar(key, value) {
  if (process.env[key] === undefined && value !== undefined) {
    process.env[key] = value;
  }
}
function setupEnvironment(args) {
  setEnvVar(_env.VERBOSE_ENV_KEY, args.verbose ? 'true' : undefined);
  setEnvVar(_env.BUNDLE_FILENAME_ENV_KEY, args.bundleOutput);
  setEnvVar(_env.SOURCEMAP_FILENAME_ENV_KEY, args.sourcemapOutput);
  setEnvVar(_env.ASSETS_DEST_ENV_KEY, args.assetsDest);
}
//# sourceMappingURL=setupEnvironment.js.map