"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  OutputPlugin: true
};
Object.defineProperty(exports, "OutputPlugin", {
  enumerable: true,
  get: function () {
    return _OutputPlugin.OutputPlugin;
  }
});
var _OutputPlugin = require("./OutputPlugin.js");
var _types = require("./types.js");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});