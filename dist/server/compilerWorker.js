"use strict";

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackConfig$watchO;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const webpackConfigPath = process.argv[2];

const webpackConfig = require(webpackConfigPath);

const watchOptions = (_webpackConfig$watchO = webpackConfig.watchOptions) !== null && _webpackConfig$watchO !== void 0 ? _webpackConfig$watchO : {};
const compiler = (0, _webpack.default)(webpackConfig);
compiler.hooks.watchRun.tap('compilerWorker', () => {
  var _process$send, _process;

  (_process$send = (_process = process).send) === null || _process$send === void 0 ? void 0 : _process$send.call(_process, {
    event: 'watchRun'
  });
});
compiler.watch(watchOptions, error => {
  if (error) {
    console.error(error);
    process.exit(2);
  }
});
//# sourceMappingURL=compilerWorker.js.map