"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _FileReporter = require("./reporters/FileReporter");

Object.keys(_FileReporter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _FileReporter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _FileReporter[key];
    }
  });
});

var _ConsoleReporter = require("./reporters/ConsoleReporter");

Object.keys(_ConsoleReporter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ConsoleReporter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ConsoleReporter[key];
    }
  });
});

var _compose = require("./compose");

Object.keys(_compose).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _compose[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _compose[key];
    }
  });
});

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

var _makeLogEntryFromFastifyLog = require("./makeLogEntryFromFastifyLog");

Object.keys(_makeLogEntryFromFastifyLog).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _makeLogEntryFromFastifyLog[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _makeLogEntryFromFastifyLog[key];
    }
  });
});
//# sourceMappingURL=index.js.map