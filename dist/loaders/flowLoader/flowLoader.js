"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flowLoader;
exports.raw = void 0;
var _flowRemoveTypes = _interopRequireDefault(require("flow-remove-types"));
var _options = require("./options.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const raw = exports.raw = false;
function flowLoader(source) {
  this.cacheable();
  const callback = this.async();
  const options = (0, _options.getOptions)(this);
  const result = (0, _flowRemoveTypes.default)(source, options);
  const sourceMap = options.pretty ? result.generateMap() : undefined;

  // @ts-expect-error
  callback(null, result.toString(), sourceMap);
}