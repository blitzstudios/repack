"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyProfile = applyProfile;
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _core = require("@rspack/core");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Reference: https://github.com/web-infra-dev/rspack/blob/bad70431988d77d8a95320066f72c77b6cc4c120/packages/rspack-cli/src/utils/profile.ts
 */

/**
 * `RSPACK_PROFILE=ALL` // all trace events
 * `RSPACK_PROFILE=OVERVIEW` // overview trace events
 * `RSPACK_PROFILE=warn,tokio::net=info` // trace filter from  https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html#example-syntax
 */

const overviewTraceFilter = 'info';
const allTraceFilter = 'trace';
const defaultRustTraceLayer = 'chrome';
function resolveLayer(value) {
  if (value === 'OVERVIEW') {
    return overviewTraceFilter;
  }
  if (value === 'ALL') {
    return allTraceFilter;
  }
  return value;
}
async function applyProfile(filterValue, traceLayer = defaultRustTraceLayer, traceOutput) {
  const {
    asyncExitHook
  } = await import('exit-hook');
  if (traceLayer !== 'chrome' && traceLayer !== 'logger') {
    throw new Error(`unsupported trace layer: ${traceLayer}`);
  }
  if (!traceOutput) {
    const timestamp = Date.now();
    const defaultOutputDir = _nodePath.default.resolve(`.rspack-profile-${timestamp}-${process.pid}`);
    const defaultRustTraceChromeOutput = _nodePath.default.join(defaultOutputDir, 'trace.json');
    const defaultRustTraceLoggerOutput = 'stdout';
    const defaultTraceOutput = traceLayer === 'chrome' ? defaultRustTraceChromeOutput : defaultRustTraceLoggerOutput;

    // biome-ignore lint/style/noParameterAssign: setting default value makes sense
    traceOutput = defaultTraceOutput;
  }
  const filter = resolveLayer(filterValue);
  await ensureFileDir(traceOutput);
  await _core.rspack.experiments.globalTrace.register(filter,
  // @ts-expect-error: legacy support for older versions of Rspack
  traceLayer, traceOutput);
  asyncExitHook(_core.rspack.experiments.globalTrace.cleanup, {
    wait: 500
  });
}
async function ensureFileDir(outputFilePath) {
  const dir = _nodePath.default.dirname(outputFilePath);
  await _nodeFs.default.promises.mkdir(dir, {
    recursive: true
  });
}