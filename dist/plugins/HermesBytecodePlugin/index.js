"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _HermesBytecodePlugin = require("./HermesBytecodePlugin.js");
Object.keys(_HermesBytecodePlugin).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _HermesBytecodePlugin[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _HermesBytecodePlugin[key];
    }
  });
});
var _ChunksToHermesBytecodePlugin = require("./ChunksToHermesBytecodePlugin.js");
Object.keys(_ChunksToHermesBytecodePlugin).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ChunksToHermesBytecodePlugin[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ChunksToHermesBytecodePlugin[key];
    }
  });
});
//# sourceMappingURL=index.js.map