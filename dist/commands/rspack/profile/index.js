"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyProfile = applyProfile;
var _core = require("@rspack/core");
function getRspackVersion() {
  // get rid of `-beta`, `-rc` etc.
  const version = _core.rspackVersion.split('-')[0];
  const [major, minor, patch] = version.split('.').map(Number);
  return {
    major,
    minor,
    patch
  };
}
async function getProfilingHandler() {
  const {
    major,
    minor
  } = getRspackVersion();
  if (major > 1 || major === 1 && minor >= 4) {
    return await import('./profile-1.4.js');
  }
  return await import('./profile-legacy.js');
}
async function applyProfile(filterValue, traceLayer, traceOutput) {
  const {
    applyProfile
  } = await getProfilingHandler();
  return applyProfile(filterValue, traceLayer, traceOutput);
}