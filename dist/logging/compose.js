"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeReporters = composeReporters;

function composeReporters(reporters) {
  return {
    process: logEntry => {
      reporters.forEach(reporter => reporter.process(logEntry));
    },
    flush: () => {
      reporters.forEach(reporter => reporter.flush());
    },
    stop: () => {
      reporters.forEach(reporter => reporter.stop());
    }
  };
}
//# sourceMappingURL=compose.js.map