"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;

var _readline = _interopRequireDefault(require("readline"));

var _server = require("../server");

var _env = require("../env");

var _getWebpackConfigPath = require("./utils/getWebpackConfigPath");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Start command for React Native CLI.
 * It runs {@link DevServerProxy} to provide Development Server functionality to React Native apps
 * in development mode.
 *
 * @param _ Original, non-parsed arguments that were provided when running this command.
 * @param config React Native CLI configuration object.
 * @param args Parsed command line arguments.
 *
 * @internal
 * @category CLI command
 */
function start(_, config, args) {
  var _args$port;

  const webpackConfigPath = (0, _getWebpackConfigPath.getWebpackConfigPath)(config.root, args.webpackConfig);
  const cliOptions = {
    config: {
      root: config.root,
      reactNativePath: config.reactNativePath,
      webpackConfigPath
    },
    command: 'start',
    arguments: {
      // `platform` is empty, since it will be filled in later by `DevServerProxy`
      start: { ...args,
        platform: ''
      }
    }
  };

  if (process.argv.includes('--verbose')) {
    process.env[_env.VERBOSE_ENV_KEY] = '1';
  }

  const DEFAULT_PORT = +process.env.RCT_METRO_PORT || 8081;
  const devServerProxy = new _server.DevServerProxy({
    host: args.host,
    port: (_args$port = args.port) !== null && _args$port !== void 0 ? _args$port : DEFAULT_PORT,
    https: args.https,
    cert: args.cert,
    key: args.key,
    context: config.root,
    platform: args.platform
  }, cliOptions);
  devServerProxy.run();

  if (args.interactive) {
    if (!process.stdin.setRawMode) {
      devServerProxy.fastify.log.warn({
        msg: 'Interactive mode is not supported in this environment'
      });
      return;
    }

    _readline.default.emitKeypressEvents(process.stdin);

    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (_key, data) => {
      const {
        ctrl,
        name
      } = data;

      if (ctrl === true) {
        switch (name) {
          case 'c':
            process.exit();
            break;

          case 'z':
            process.emit('SIGTSTP', 'SIGTSTP');
            break;
        }
      } else if (name === 'r') {
        devServerProxy.wsMessageServer.broadcast('reload');
        devServerProxy.fastify.log.info({
          msg: 'Reloading app'
        });
      } else if (name === 'd') {
        devServerProxy.wsMessageServer.broadcast('devMenu');
        devServerProxy.fastify.log.info({
          msg: 'Opening developer menu'
        });
      }
    });
  }
}
//# sourceMappingURL=start.js.map