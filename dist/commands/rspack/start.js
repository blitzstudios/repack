"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;
var _package = _interopRequireDefault(require("../../../package.json"));
var _index = require("../../logging/index.js");
var _cliError = require("../common/cliError.js");
var _makeCompilerConfig = require("../common/config/makeCompilerConfig.js");
var _index2 = require("../common/index.js");
var _logo = _interopRequireDefault(require("../common/logo.js"));
var _setupEnvironment = require("../common/setupEnvironment.js");
var _Compiler = require("./Compiler.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Start command that runs a development server.
 * It runs `@callstack/repack-dev-server` to provide Development Server functionality
 * in development mode.
 *
 * @param _ Original, non-parsed arguments that were provided when running this command.
 * @param cliConfig Configuration object containing platform and project settings.
 * @param args Parsed command line arguments.
 */
async function start(_, cliConfig, args) {
  const detectedPlatforms = Object.keys(cliConfig.platforms);
  if (args.platform && !detectedPlatforms.includes(args.platform)) {
    throw new _cliError.CLIError(`Unrecognized platform: ${args.platform}`);
  }
  const configs = await (0, _makeCompilerConfig.makeCompilerConfig)({
    args: args,
    bundler: 'rspack',
    command: 'start',
    rootDir: cliConfig.root,
    platforms: args.platform ? [args.platform] : detectedPlatforms,
    reactNativePath: cliConfig.reactNativePath
  });

  // expose selected args as environment variables
  (0, _setupEnvironment.setupEnvironment)(args);
  const devServerOptions = configs[0].devServer ?? {};
  const showHttpRequests = args.verbose || args.logRequests;
  const reporter = (0, _index.composeReporters)([new _index.ConsoleReporter({
    asJson: args.json,
    isVerbose: args.verbose
  }), args.logFile ? new _index.FileReporter({
    filename: args.logFile
  }) : undefined].filter(Boolean));
  process.stdout.write((0, _logo.default)(_package.default.version, 'Rspack'));
  const compiler = new _Compiler.Compiler(configs, reporter, cliConfig.root);
  const {
    createServer
  } = await import('@callstack/repack-dev-server');
  const {
    start,
    stop
  } = await createServer({
    options: {
      ...devServerOptions,
      rootDir: cliConfig.root,
      logRequests: showHttpRequests
    },
    delegate: ctx => {
      if (args.interactive) {
        (0, _index2.setupInteractions)({
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
            fetch(`${ctx.options.url}/open-debugger`, {
              method: 'POST'
            }).catch(() => {
              ctx.log.warn('Failed to open React Native DevTools');
            });
          },
          onAdbReverse() {
            void (0, _index2.runAdbReverse)({
              port: ctx.options.port,
              logger: ctx.log,
              verbose: true
            });
          }
        }, {
          logger: ctx.log
        });
      }
      if (args.reversePort) {
        void (0, _index2.runAdbReverse)({
          logger: ctx.log,
          port: ctx.options.port,
          wait: true
        });
      }
      compiler.setDevServerContext(ctx);
      return {
        compiler: {
          getAsset: (filename, platform) => {
            const parsedUrl = (0, _index2.parseFileUrl)(filename, 'file:///');
            return compiler.getSource(parsedUrl.filename, platform);
          },
          getMimeType: filename => (0, _index2.getMimeType)(filename),
          inferPlatform: uri => {
            const {
              platform
            } = (0, _index2.parseFileUrl)(uri, 'file:///');
            return platform;
          }
        },
        symbolicator: {
          getSource: fileUrl => {
            const {
              filename,
              platform
            } = (0, _index2.parseFileUrl)(fileUrl);
            return compiler.getSource(filename, platform);
          },
          getSourceMap: fileUrl => {
            const {
              filename,
              platform
            } = (0, _index2.parseFileUrl)(fileUrl);
            return compiler.getSourceMap(filename, platform);
          },
          shouldIncludeFrame: frame => {
            // If the frame points to internal bootstrap/module system logic, skip the code frame.
            return !/webpack[/\\]runtime[/\\].+\s/.test(frame.file);
          }
        },
        messages: {
          getHello: () => 'React Native packager is running',
          getStatus: () => 'packager-status:running'
        },
        logger: {
          onMessage: log => {
            const logEntry = (0, _index.makeLogEntryFromFastifyLog)(log);
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