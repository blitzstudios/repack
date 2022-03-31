"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformFastifyLogToLogEntry = transformFastifyLogToLogEntry;

function transformFastifyLogToLogEntry(data) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    level,
    time,
    pid,
    hostname,
    ...rest
  } = JSON.parse(data);
  const levelToTypeMapping = {
    10: 'debug',
    20: 'debug',
    30: 'info',
    40: 'warn',
    50: 'error',
    60: 'error'
  };
  return {
    type: levelToTypeMapping[level],
    timestamp: time,
    issuer: '',
    message: [rest]
  };
}
//# sourceMappingURL=transformFastifyLogToWebpackLogEntry.js.map