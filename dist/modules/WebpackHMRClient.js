import TcpSocket from 'react-native-tcp-socket';
import { getDevServerLocation } from './getDevServerLocation.js';
class HMRClient {
  // state
  lastCompilationHash = null;
  constructor(app) {
    this.app = app;
    this.url = `ws://${getDevServerLocation().host}/__hmr`;
    this.socket = new WebSocket(this.url);
    console.debug('[HMRClient] Connecting...', {
      url: this.url
    });
    this.socket.onopen = () => {
      console.debug('[HMRClient] Connected');
      // hide the `Downloading 100%` message
      this.app.hideLoadingView();
    };
    this.socket.onclose = () => {
      console.debug('[HMRClient] Disconnected');
    };
    this.socket.onerror = event => {
      console.debug('[HMRClient] Error', event);
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
  sendTcpSocket(message) {
    let tempConnection = null;
    try {
      tempConnection = TcpSocket.createConnection({
        port: 9093,
        host: __LISTENER_IP__,
        reuseAddress: true
      }, () => {
        const json = JSON.stringify({
          _webpack: message
        });
        tempConnection?.write(json);
        tempConnection?.destroy();
      });
      tempConnection.on('error', () => {
        tempConnection?.destroy();
      });
    } catch (e) {
      console.log('[HMRClient] Send TCPSocket failed: ', e);
      tempConnection?.destroy();
    }
  }
  processMessage(message) {
    // Only process messages for the target platform
    if (message.body.name !== __PLATFORM__) {
      return;
    }
    switch (message.action) {
      case 'compiling':
        this.sendTcpSocket('building');
        this.handleCompilationInProgress();
        break;
      case 'hash':
        this.handleHashUpdate(message.body.hash);
        break;
      case 'ok':
        this.sendTcpSocket('built');
        this.handleBundleUpdate();
        break;
    }
  }
  handleCompilationInProgress() {
    console.debug('[HMRClient] Processing progress update');
    this.app.showLoadingView('Compiling...', 'refresh');
  }
  handleHashUpdate(hash) {
    console.debug('[HMRClient] Processing hash update');
    this.lastCompilationHash = hash ?? null;
  }
  handleBundleUpdate() {
    console.debug('[HMRClient] Processing bundle update');
    this.tryApplyUpdates();
    this.app.hideLoadingView();
  }
  isUpdateAvailable() {
    return this.lastCompilationHash !== __webpack_hash__;
  }

  // Attempt to update code on the fly, fall back to a hard reload.
  tryApplyUpdates() {
    // detect is there a newer version of this code available
    if (!this.isUpdateAvailable()) {
      return;
    }
    if (!module.hot) {
      // HMR is not enabled
      this.app.reload();
      return;
    }
    if (module.hot.status() !== 'idle') {
      // HMR is disallowed in other states than 'idle'
      return;
    }
    const handleApplyUpdates = (err, updatedModules) => {
      const forcedReload = err || !updatedModules;
      if (forcedReload) {
        console.warn('[HMRClient] Forced reload');
        if (err) {
          console.debug('[HMRClient] Forced reload caused by: ', err);
        }
        this.app.reload();
        return;
      }
      if (this.isUpdateAvailable()) {
        // While we were updating, there was a new update! Do it again.
        this.tryApplyUpdates();
      }
    };
    console.debug('[HMRClient] Checking for updates on the server...');
    module.hot.check({
      onAccepted: this.app.dismissErrors,
      onDeclined: this.app.dismissErrors,
      onErrored: this.app.dismissErrors,
      onUnaccepted: this.app.dismissErrors,
      onDisposed: this.app.dismissErrors
    }).then(outdatedModules => handleApplyUpdates(null, outdatedModules), err => handleApplyUpdates(err, null));
  }
}
if (__DEV__ && module.hot) {
  const reload = () => {
    const DevSettings = require('react-native/Libraries/Utilities/DevSettings');
    DevSettings.reload();
  };
  const dismissErrors = () => {
    if (__PLATFORM__ === 'ios') {
      const NativeRedBox = require('react-native/Libraries/NativeModules/specs/NativeRedBox').default;
      NativeRedBox?.dismiss?.();
    } else {
      const NativeExceptionsManager = require('react-native/Libraries/Core/NativeExceptionsManager').default;
      NativeExceptionsManager?.dismissRedbox();
    }
    const LogBoxData = require('react-native/Libraries/LogBox/Data/LogBoxData');
    LogBoxData.clear();
  };
  const showLoadingView = (text, type) => {
    let LoadingView;
    if (__REACT_NATIVE_MINOR_VERSION__ >= 75) {
      LoadingView = require('react-native/Libraries/Utilities/DevLoadingView');
    } else {
      LoadingView = require('react-native/Libraries/Utilities/LoadingView');
    }
    LoadingView.showMessage(text, type);
  };
  const hideLoadingView = () => {
    let LoadingView;
    if (__REACT_NATIVE_MINOR_VERSION__ >= 75) {
      LoadingView = require('react-native/Libraries/Utilities/DevLoadingView');
    } else {
      LoadingView = require('react-native/Libraries/Utilities/LoadingView');
    }
    LoadingView.hide();
  };
  new HMRClient({
    reload,
    dismissErrors,
    showLoadingView,
    hideLoadingView
  });
}
//# sourceMappingURL=WebpackHMRClient.js.map