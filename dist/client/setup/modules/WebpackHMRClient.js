"use strict";

var _getDevServerLocation = require("../utils/getDevServerLocation");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HMRClient {
  constructor(app) {
    this.app = app;

    _defineProperty(this, "url", void 0);

    _defineProperty(this, "socket", void 0);

    _defineProperty(this, "lastHash", '');

    this.url = `ws://${(0, _getDevServerLocation.getDevServerLocation)().hostname}:${__PUBLIC_PORT__}/__hmr`;
    this.socket = new WebSocket(this.url);
    console.log('[HMRClient] Connecting...', {
      url: this.url
    });

    this.socket.onopen = () => {
      console.log('[HMRClient] Connected');
    };

    this.socket.onclose = () => {
      console.log('[HMRClient] Disconnected');
    };

    this.socket.onerror = event => {
      console.log('[HMRClient] Error', event);
    };

    this.socket.onmessage = event => {
      try {
        this.processMessage(JSON.parse(event.data.toString()));
      } catch (error) {
        console.warn('[HMRClient] Invalid HMR message', {
          event,
          error
        });
      }
    };
  }

  upToDate(hash) {
    if (hash) {
      this.lastHash = hash;
    }

    return this.lastHash === __webpack_hash__;
  }

  processMessage(message) {
    var _message$body, _message$body2, _message$body3, _message$body$errors, _message$body$warning;

    switch (message.action) {
      case 'building':
        this.app.LoadingView.showMessage('Rebuilding...', 'refresh');
        console.log('[HMRClient] Bundle rebuilding', {
          name: (_message$body = message.body) === null || _message$body === void 0 ? void 0 : _message$body.name
        });
        break;

      case 'built':
        console.log('[HMRClient] Bundle rebuilt', {
          name: (_message$body2 = message.body) === null || _message$body2 === void 0 ? void 0 : _message$body2.name,
          time: (_message$body3 = message.body) === null || _message$body3 === void 0 ? void 0 : _message$body3.time
        });
      // Fall through

      case 'sync':
        if (!message.body) {
          console.warn('[HMRClient] HMR message body is empty');
          return;
        }

        if ((_message$body$errors = message.body.errors) !== null && _message$body$errors !== void 0 && _message$body$errors.length) {
          message.body.errors.forEach(error => {
            console.error('Cannot apply update due to error:', error);
          });
          this.app.LoadingView.hide();
          return;
        }

        if ((_message$body$warning = message.body.warnings) !== null && _message$body$warning !== void 0 && _message$body$warning.length) {
          message.body.warnings.forEach(warning => {
            console.warn('[HMRClient] Bundle contains warnings:', warning);
          });
        }

        this.applyUpdate(message.body);
    }
  }

  applyUpdate(update) {
    if (!module.hot) {
      throw new Error('[HMRClient] Hot Module Replacement is disabled.');
    }

    if (!this.upToDate(update.hash) && module.hot.status() === 'idle') {
      console.log('[HMRClient] Checking for updates on the server...');
      this.checkUpdates(update);
    }
  }

  async checkUpdates(update) {
    try {
      var _module$hot, _module$hot2;

      this.app.LoadingView.showMessage('Refreshing...', 'refresh');
      const updatedModules = await ((_module$hot = module.hot) === null || _module$hot === void 0 ? void 0 : _module$hot.check(false));

      if (!updatedModules) {
        console.warn('[HMRClient] Cannot find update - full reload needed');
        this.app.reload();
        return;
      }

      const renewedModules = await ((_module$hot2 = module.hot) === null || _module$hot2 === void 0 ? void 0 : _module$hot2.apply({
        ignoreDeclined: true,
        ignoreUnaccepted: false,
        ignoreErrored: false,
        onDeclined: data => {
          // This module declined update, no need to do anything
          console.warn('[HMRClient] Ignored an update due to declined module', {
            chain: data.chain
          });
        }
      }));

      if (!this.upToDate()) {
        this.checkUpdates(update);
      } // Double check to make sure all updated modules were accepted (renewed)


      const unacceptedModules = updatedModules.filter(moduleId => {
        return renewedModules && renewedModules.indexOf(moduleId) < 0;
      });

      if (unacceptedModules.length) {
        console.warn('[HMRClient] Not every module was accepted - full reload needed', {
          unacceptedModules
        });
        this.app.reload();
      } else {
        console.log('[HMRClient] Renewed modules - app is up to date', {
          renewedModules
        });
        this.app.dismissErrors();
      }
    } catch (error) {
      var _module$hot3, _module$hot4;

      if (((_module$hot3 = module.hot) === null || _module$hot3 === void 0 ? void 0 : _module$hot3.status()) === 'fail' || ((_module$hot4 = module.hot) === null || _module$hot4 === void 0 ? void 0 : _module$hot4.status()) === 'abort') {
        console.warn('[HMRClient] Cannot check for update - full reload needed');
        console.warn('[HMRClient]', error);
        this.app.reload();
      } else {
        console.warn('[HMRClient] Update check failed', {
          error
        });
      }
    } finally {
      this.app.LoadingView.hide();
    }
  }

}

if (__DEV__ && module.hot) {
  const {
    DevSettings,
    Platform
  } = require('react-native');

  const LoadingView = require('react-native/Libraries/Utilities/LoadingView');

  const reload = () => DevSettings.reload();

  const dismissErrors = () => {
    if (Platform.OS === 'ios') {
      var _NativeRedBox$dismiss;

      const NativeRedBox = require('react-native/Libraries/NativeModules/specs/NativeRedBox').default;

      NativeRedBox === null || NativeRedBox === void 0 ? void 0 : (_NativeRedBox$dismiss = NativeRedBox.dismiss) === null || _NativeRedBox$dismiss === void 0 ? void 0 : _NativeRedBox$dismiss.call(NativeRedBox);
    } else {
      const NativeExceptionsManager = require('react-native/Libraries/Core/NativeExceptionsManager').default;

      NativeExceptionsManager === null || NativeExceptionsManager === void 0 ? void 0 : NativeExceptionsManager.dismissRedbox();
    }

    const LogBoxData = require('react-native/Libraries/LogBox/Data/LogBoxData');

    LogBoxData.clear();
  };

  new HMRClient({
    reload,
    dismissErrors,
    LoadingView
  });
}
//# sourceMappingURL=WebpackHMRClient.js.map