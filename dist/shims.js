"use strict";

var _stringPrototype = _interopRequireDefault(require("string.prototype.replaceall"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore
// `.replaceAll` has to be shimmed in Node 14
_stringPrototype.default.shim();
//# sourceMappingURL=shims.js.map