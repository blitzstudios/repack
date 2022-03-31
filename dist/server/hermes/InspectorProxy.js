"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InspectorProxy = void 0;

var _url = require("url");

var _Device = _interopRequireDefault(require("metro-inspector-proxy/src/Device"));

var _ws = require("../ws");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const WS_DEVICE_URL = '/inspector/device';
const WS_DEBUGGER_URL = '/inspector/debug';

class InspectorProxy extends _ws.WebSocketServer {
  constructor(fastify, config) {
    super(fastify, [WS_DEVICE_URL, WS_DEBUGGER_URL]);
    this.config = config;

    _defineProperty(this, "devices", new Map());

    _defineProperty(this, "deviceCounter", 0);

    _defineProperty(this, "serverHost", void 0);

    this.serverHost = `${this.config.host || 'localhost'}:${this.config.port}`;
    this.setup();
  }

  setup() {
    const onSend = (_request, reply, _payload, done) => {
      reply.headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-cache',
        Connection: 'close'
      });
      done();
    };

    this.fastify.get('/json/version', {
      onSend
    }, async () => {
      return {
        Browser: 'Mobile JavaScript',
        'Protocol-Version': '1.1'
      };
    });

    const pageListHandler = async () => {
      const pages = [];

      for (const [deviceId, device] of this.devices) {
        const devicePages = device.getPagesList();

        for (const page of devicePages) {
          pages.push(this.buildPageDescription(deviceId, page));
        }
      }

      return pages;
    };

    this.fastify.get('/json/list', {
      onSend
    }, pageListHandler);
    this.fastify.get('/json', {
      onSend
    }, pageListHandler);
  }

  buildPageDescription(deviceId, page) {
    const debuggerUrl = `${this.serverHost}${WS_DEBUGGER_URL}?device=${deviceId}&page=${page.id}`;
    const webSocketDebuggerUrl = 'ws://' + debuggerUrl;
    const devtoolsFrontendUrl = 'chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=' + encodeURIComponent(debuggerUrl);
    return {
      id: `${deviceId}-${page.id}`,
      description: page.app,
      title: page.title,
      faviconUrl: 'https://reactjs.org/favicon.ico',
      devtoolsFrontendUrl,
      type: 'node',
      webSocketDebuggerUrl,
      vm: page.vm
    };
  }
  /**
   * Process new WebSocket connection from device.
   *
   * @param socket Incoming device's WebSocket connection.
   * @param request Upgrade request for the connection.
   */


  onConnection(socket, request) {
    try {
      const {
        url = ''
      } = request;
      const {
        searchParams
      } = new _url.URL(url, 'http://localhost');

      if (url.startsWith('/inspector/device')) {
        var _searchParams$get, _searchParams$get2;

        const deviceName = (_searchParams$get = searchParams.get('name')) !== null && _searchParams$get !== void 0 ? _searchParams$get : 'Unknown';
        const appName = (_searchParams$get2 = searchParams.get('app')) !== null && _searchParams$get2 !== void 0 ? _searchParams$get2 : 'Unknown';
        const deviceId = this.deviceCounter++;
        this.devices.set(deviceId, new _Device.default(deviceId, deviceName, appName, socket, this.config.context));
        this.fastify.log.info({
          msg: 'Hermes device connected',
          deviceId
        });

        const onClose = () => {
          this.fastify.log.info({
            msg: 'Hermes device disconnected',
            deviceId
          });
          this.devices.delete(deviceId);
        };

        socket.addEventListener('error', onClose);
        socket.addEventListener('close', onClose);
      } else {
        var _searchParams$get3, _searchParams$get4;

        const deviceId = (_searchParams$get3 = searchParams.get('device')) !== null && _searchParams$get3 !== void 0 ? _searchParams$get3 : undefined;
        const pageId = (_searchParams$get4 = searchParams.get('page')) !== null && _searchParams$get4 !== void 0 ? _searchParams$get4 : undefined;

        if (deviceId === undefined || pageId === undefined) {
          throw new Error('Incorrect URL - must provide device and page IDs');
        }

        const device = this.devices.get(parseInt(deviceId, 10));

        if (!device) {
          throw new Error('Unknown device with ID ' + deviceId);
        }

        device.handleDebuggerConnection(socket, pageId);
      }
    } catch (error) {
      this.fastify.log.error({
        msg: 'Failed to establish connection with Hermes device',
        error: error.message
      });
      socket.close(1011, error.toString());
    }
  }

}

exports.InspectorProxy = InspectorProxy;
//# sourceMappingURL=InspectorProxy.js.map