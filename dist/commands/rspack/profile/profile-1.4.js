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
 * Reference: https://github.com/web-infra-dev/rspack/blob/bdfe548f4e5fd09c1ccb4d43919426819fb9a34f/packages/rspack-cli/src/utils/profile.ts
 */

/**
 * `RSPACK_PROFILE=ALL` // all trace events
 * `RSPACK_PROFILE=OVERVIEW` // overview trace events
 * `RSPACK_PROFILE=warn,tokio::net=info` // trace filter from  https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html#example-syntax
 */

const defaultRustTraceLayer = 'perfetto';
async function applyProfile(filterValue, traceLayer = defaultRustTraceLayer, traceOutput) {
  const {
    asyncExitHook
  } = await import('exit-hook');
  if (traceLayer !== 'logger' && traceLayer !== 'perfetto') {
    throw new Error(`unsupported trace layer: ${traceLayer}`);
  }
  const timestamp = Date.now();
  const defaultOutputDir = _nodePath.default.resolve(`.rspack-profile-${timestamp}-${process.pid}`);
  if (!traceOutput) {
    const defaultRustTracePerfettoOutput = _nodePath.default.resolve(defaultOutputDir, 'rspack.pftrace');
    const defaultRustTraceLoggerOutput = 'stdout';
    const defaultTraceOutput = traceLayer === 'perfetto' ? defaultRustTracePerfettoOutput : defaultRustTraceLoggerOutput;

    // biome-ignore lint/style/noParameterAssign: setting default value makes sense
    traceOutput = defaultTraceOutput;
  } else if (traceOutput !== 'stdout' && traceOutput !== 'stderr') {
    // if traceOutput is not stdout or stderr, we need to ensure the directory exists
    // biome-ignore lint/style/noParameterAssign: setting default value makes sense
    traceOutput = _nodePath.default.resolve(defaultOutputDir, traceOutput);
  }
  await ensureFileDir(traceOutput);
  await _core.rspack.experiments.globalTrace.register(filterValue, traceLayer, traceOutput);
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