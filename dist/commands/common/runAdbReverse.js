"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runAdbReverse = runAdbReverse;
var _execa = _interopRequireDefault(require("execa"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
async function runAdbReverse(port, logger = console) {
  const adbPath = process.env.ANDROID_HOME ? `${process.env.ANDROID_HOME}/platform-tools/adb` : 'adb';
  const command = `${adbPath} reverse tcp:${port} tcp:${port}`;
  try {
    await _execa.default.command(command);
    logger.info(`Successfully run: ${command}`);
  } catch (error) {
    // Get just the error message
    const message = error.message.split('error:')[1] || error.message;
    logger.warn(`Failed to run: ${command} - ${message.trim()}`);
  }
}
//# sourceMappingURL=runAdbReverse.js.map