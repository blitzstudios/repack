"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;
var colorette = _interopRequireWildcard(require("colorette"));
var _package = _interopRequireDefault(require("../../../package.json"));
var _logging = require("../../logging");
var _common = require("../common");
var _consts = require("../consts");
var _Compiler = require("./Compiler");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
async function start(_, cliConfig, args) {
  const rspackConfigPath = (0, _common.getRspackConfigFilePath)(cliConfig.root, args.webpackConfig);
  const {
    reversePort: reversePortArg,
    ...restArgs
  } = args;
  const cliOptions = {
    config: {
      root: cliConfig.root,
      platforms: Object.keys(cliConfig.platforms),
      bundlerConfigPath: rspackConfigPath,
      reactNativePath: cliConfig.reactNativePath
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
  // TODO fix (jbroma)
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

  // @ts-ignore
  const compiler = new _Compiler.Compiler(cliOptions, reporter);
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
      compiler.setDevServerContext(ctx);
      return {
        compiler: {
          getAsset: (filename, platform) => {
            const parsedUrl = (0, _common.parseFileUrl)(filename, 'file:///');
            return compiler.getSource(parsedUrl.filename, platform);
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
              body: compiler.getHmrBody(platform)
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
          getPlatforms: () => Promise.resolve(compiler.platforms),
          getAssets: platform => Promise.resolve(Object.entries(compiler.assetsCache[platform] ?? {}).map(([name, asset]) => ({
            name,
            size: asset.size
          }))),
          getCompilationStats: platform => Promise.resolve(compiler.statsCache[platform] ?? null)
        }
      };
    }
  });
  await compiler.init();
  await start();
  compiler.start();
  return {
    stop: async () => {
      reporter.stop();
      await stop();
    }
  };
}
//# sourceMappingURL=start.js.map