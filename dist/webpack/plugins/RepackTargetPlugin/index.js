"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _RepackTargetPlugin = require("./RepackTargetPlugin");

Object.keys(_RepackTargetPlugin).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _RepackTargetPlugin[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _RepackTargetPlugin[key];
    }
  });
});
//# sourceMappingURL=index.js.map