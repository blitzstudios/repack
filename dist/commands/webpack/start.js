"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;
var _path = _interopRequireDefault(require("path"));
var colorette = _interopRequireWildcard(require("colorette"));
var _package = _interopRequireDefault(require("../../../package.json"));
var _logging = require("../../logging");
var _common = require("../common");
var _consts = require("../consts");
var _Compiler = require("./Compiler");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Start command for React Native Community CLI.
 * It runs `@callstack/repack-dev-server` to provide Development Server functionality to React Native apps
 * in development mode.
 *
 * @param _ Original, non-parsed arguments that were provided when running this command.
 * @param config React Native Community CLI configuration object.
 * @param args Parsed command line arguments.
 *
 * @internal
 * @category CLI command
 */
async function start(_, config, args) {
  const webpackConfigPath = (0, _common.getWebpackConfigFilePath)(config.root, args.webpackConfig);
  const {
    reversePort: reversePortArg,
    sendEvents: sendEventsArg,
    ...restArgs
  } = args;
  const cliOptions = {
    config: {
      root: config.root,
      platforms: Object.keys(config.platforms),
      bundlerConfigPath: webpackConfigPath,
      reactNativePath: config.reactNativePath
    },
    command: 'start',
    arguments: {
      start: {
        ...restArgs
      }
    }
  };
  if (args.platform && !cliOptions.config.platforms.includes(args.platform)) {
    throw new Error('Unrecognized platform: ' + args.platform);
  }
  const reversePort = reversePortArg ?? process.argv.includes('--reverse-port');
  const isSilent = args.silent;
  const isVerbose = isSilent ? false :
  // TODO fix in a separate PR (jbroma)
  // biome-ignore format: fix in a separate PR
  args.verbose ?? process.argv.includes('--verbose');
  const showHttpRequests = isVerbose || args.logRequests;
  const reporter = (0, _logging.composeReporters)([new _logging.ConsoleReporter({
    asJson: args.json,
    level: isSilent ? 'silent' : isVerbose ? 'verbose' : 'normal'
  }), args.logFile ? new _logging.FileReporter({
    filename: args.logFile
  }) : undefined].filter(Boolean));
  if (!isSilent) {
    const version = _package.default.version;
    process.stdout.write(colorette.bold(colorette.cyan('📦 Re.Pack ' + version + '\n\n')));
  }
  const compiler = new _Compiler.Compiler(cliOptions, reporter, isVerbose);
  const serverHost = args.host || _consts.DEFAULT_HOSTNAME;
  const serverPort = args.port ?? _consts.DEFAULT_PORT;
  const serverURL = `${args.https === true ? 'https' : 'http'}://${serverHost}:${serverPort}`;
  const {
    createServer
  } = await import('@callstack/repack-dev-server');
  const {
    start,
    stop
  } = await createServer({
    options: {
      rootDir: cliOptions.config.root,
      host: serverHost,
      port: serverPort,
      https: args.https ? {
        cert: args.cert,
        key: args.key
      } : undefined,
      logRequests: showHttpRequests
    },
    experiments: {
      experimentalDebugger: args.experimentalDebugger
    },
    delegate: ctx => {
      if (args.interactive) {
        (0, _common.setupInteractions)({
          onReload() {
            ctx.broadcastToMessageClients({
              method: 'reload'
            });
          },
          onOpenDevMenu() {
            ctx.broadcastToMessageClients({
              method: 'devMenu'
            });
          },
          onOpenDevTools() {
            void fetch(`${serverURL}/open-debugger`, {
              method: 'POST'
            });
          }
        }, ctx.log);
      }
      if (reversePort && args.port) {
        void (0, _common.runAdbReverse)(args.port, ctx.log);
      }
      const lastStats = {};
      compiler.on('watchRun', ({
        platform
      }) => {
        console.log('[CompilerPlugin] hook: watchRun');
        ctx.notifyBuildStart(platform);
        if (platform === 'android') {
          void (0, _common.runAdbReverse)(args.port ?? _consts.DEFAULT_PORT, ctx.log);
        }
      });
      compiler.on('invalid', ({
        platform
      }) => {
        console.log('[CompilerPlugin] hook: invalid');
        ctx.notifyBuildStart(platform);
        ctx.broadcastToHmrClients({
          action: 'building'
        }, platform);
      });
      compiler.on('done', ({
        platform,
        stats
      }) => {
        console.log('[CompilerPlugin] hook: done');
        ctx.notifyBuildEnd(platform);
        lastStats[platform] = stats;
        ctx.broadcastToHmrClients({
          action: 'built',
          body: createHmrBody(stats)
        }, platform);
      });
      return {
        compiler: {
          getAsset: (filename, platform, sendProgress) => {
            const parsedUrl = (0, _common.parseFileUrl)(filename, 'file:///');
            return compiler.getSource(parsedUrl.filename, platform, sendProgress);
          },
          getMimeType: filename => (0, _common.getMimeType)(filename),
          inferPlatform: uri => {
            const {
              platform
            } = (0, _common.parseFileUrl)(uri, 'file:///');
            return platform;
          }
        },
        symbolicator: {
          getSource: fileUrl => {
            const {
              filename,
              platform
            } = (0, _common.parseFileUrl)(fileUrl);
            return compiler.getSource(filename, platform);
          },
          getSourceMap: fileUrl => {
            const {
              filename,
              platform
            } = (0, _common.parseFileUrl)(fileUrl);
            return compiler.getSourceMap(filename, platform);
          },
          shouldIncludeFrame: frame => {
            // If the frame points to internal bootstrap/module system logic, skip the code frame.
            return !/webpack[/\\]runtime[/\\].+\s/.test(frame.file);
          }
        },
        hmr: {
          getUriPath: () => '/__hmr',
          onClientConnected: (platform, clientId) => {
            ctx.broadcastToHmrClients({
              action: 'sync',
              body: createHmrBody(lastStats[platform])
            }, platform, [clientId]);
          }
        },
        messages: {
          getHello: () => 'React Native packager is running',
          getStatus: () => 'packager-status:running'
        },
        logger: {
          onMessage: log => {
            const logEntry = (0, _logging.makeLogEntryFromFastifyLog)(log);
            logEntry.issuer = 'DevServer';
            reporter.process(logEntry);
          }
        },
        api: {
          getPlatforms: () => Promise.resolve(Object.keys(compiler.workers)),
          getAssets: platform => Promise.resolve(Object.entries(compiler.assetsCache[platform] ?? {}).map(([name, asset]) => ({
            name,
            size: asset.size
          }))),
          getCompilationStats: platform => Promise.resolve(compiler.statsCache[platform] ?? null)
        }
      };
    }
  });
  await start();
  let sendEventsStop = () => {};
  if (sendEventsArg) {
    const sendEventsPath = _path.default.join(config.root, sendEventsArg);
    const {
      default: sendEvents
    } = await import(sendEventsPath);
    sendEventsStop = await sendEvents(config.root);
  }
  return {
    stop: async () => {
      reporter.stop();
      sendEventsStop();
      await stop();
    }
  };
}
function createHmrBody(stats) {
  if (!stats) {
    return null;
  }
  return {
    name: stats.name ?? '',
    time: stats.time ?? 0,
    hash: stats.hash ?? '',
    warnings: stats.warnings || [],
    errors: stats.errors || []
  };
}
//# sourceMappingURL=start.js.map