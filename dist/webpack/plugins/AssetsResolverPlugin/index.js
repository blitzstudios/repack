"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AssetsResolverPlugin = require("./AssetsResolverPlugin");

Object.keys(_AssetsResolverPlugin).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _AssetsResolverPlugin[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _AssetsResolverPlugin[key];
    }
  });
});
//# sourceMappingURL=index.js.map