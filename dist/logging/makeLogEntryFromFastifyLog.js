"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeLogEntryFromFastifyLog = makeLogEntryFromFastifyLog;
function makeLogEntryFromFastifyLog(data) {
  const {
    level,
    time,
    pid,
    hostname,
    ...rest
  } = data;
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
//# sourceMappingURL=makeLogEntryFromFastifyLog.js.map