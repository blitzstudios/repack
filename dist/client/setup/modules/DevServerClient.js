"use strict";

var _prettyFormat = _interopRequireDefault(require("pretty-format"));

var _getDevServerLocation = require("../utils/getDevServerLocation");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * With Webpack we don't use built-in metro-specific HMR client,
 * so the module `react-native/Libraries/Utilities/HMRClient.js` should be replaced with this one.
 *
 * Most of the code is noop apart from the `log` function which handles sending logs from client
 * application to the dev server.
 *
 * The console gets "polyfilled" here:
 * https://github.com/facebook/react-native/blob/v0.63.4/Libraries/Core/setUpDeveloperTools.js#L51-L69
 */
class DevServerClient {
  constructor() {
    _defineProperty(this, "socket", void 0);

    _defineProperty(this, "buffer", []);

    const initSocket = () => {
      const address = `ws://${(0, _getDevServerLocation.getDevServerLocation)().host}/__client`;
      this.socket = new WebSocket(address);

      const onClose = event => {
        console.warn('Disconnected from the Dev Server:', event.message);
        this.socket = undefined;
      };

      this.socket.onclose = onClose;
      this.socket.onerror = onClose;

      this.socket.onopen = () => {
        this.flushBuffer();
      };
    };

    if (__DEV__) {
      initSocket();
    }
  }

  send(level, data) {
    try {
      var _this$socket;

      (_this$socket = this.socket) === null || _this$socket === void 0 ? void 0 : _this$socket.send(JSON.stringify({
        type: 'client-log',
        level,
        data: data.map(item => typeof item === 'string' ? item : (0, _prettyFormat.default)(item, {
          escapeString: true,
          highlight: true,
          maxDepth: 3,
          min: true,
          plugins: [_prettyFormat.default.plugins.ReactElement]
        }))
      }));
    } catch {// Ignore error
    }
  }

  flushBuffer() {
    for (const {
      level,
      data
    } of this.buffer) {
      this.send(level, data);
    }

    this.buffer = [];
  }

  log(level, data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.flushBuffer();
      this.send(level, data);
    } else {
      this.buffer.push({
        level,
        data
      });
    }
  }

}

const client = new DevServerClient();
module.exports = {
  setup() {},

  enable() {},

  disable() {},

  registerBundle() {},

  log(level, data) {
    client.log(level, data);
  }

};
//# sourceMappingURL=DevServerClient.js.map