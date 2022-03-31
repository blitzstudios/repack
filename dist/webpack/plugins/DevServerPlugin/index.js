"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DevServerPlugin = require("./DevServerPlugin");

Object.keys(_DevServerPlugin).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _DevServerPlugin[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _DevServerPlugin[key];
    }
  });
});
//# sourceMappingURL=index.js.map