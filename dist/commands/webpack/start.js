"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;
var _path = _interopRequireDefault(require("path"));
var _package = _interopRequireDefault(require("../../../package.json"));
var _env = require("../../env.js");
var _index = require("../../helpers/index.js");
var _index2 = require("../../logging/index.js");
var _makeCompilerConfig = require("../common/config/makeCompilerConfig.js");
var _index3 = require("../common/index.js");
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
  const {
    sendEvents: sendEventsArg
  } = args;
  const detectedPlatforms = Object.keys(cliConfig.platforms);
  if (args.platform && !detectedPlatforms.includes(args.platform)) {
    throw new _index.CLIError(`Unrecognized platform: ${args.platform}`);
  }
  const platforms = args.platform ? [args.platform] : detectedPlatforms;
  const configs = await (0, _makeCompilerConfig.makeCompilerConfig)({
    args: args,
    bundler: 'webpack',
    command: 'start',
    rootDir: cliConfig.root,
    platforms: platforms,
    reactNativePath: cliConfig.reactNativePath
  });

  // expose selected args as environment variables
  (0, _setupEnvironment.setupEnvironment)(args);
  const isVerbose = (0, _index.isTruthyEnv)(process.env[_env.VERBOSE_ENV_KEY]);
  const devServerOptions = configs[0].devServer ?? {};
  const showHttpRequests = isVerbose || args.logRequests;

  // dynamically import dev middleware to match version of react-native
  const devMiddleware = await (0, _index3.getDevMiddleware)(cliConfig.reactNativePath);
  const reporter = (0, _index2.composeReporters)([new _index2.ConsoleReporter({
    asJson: args.json,
    isVerbose: isVerbose
  }), args.logFile ? new _index2.FileReporter({
    filename: args.logFile
  }) : undefined].filter(Boolean));
  process.stdout.write((0, _logo.default)(_package.default.version, 'webpack'));
  if (args.resetCache) {
    (0, _index3.resetPersistentCache)({
      bundler: 'webpack',
      rootDir: cliConfig.root,
      cacheConfigs: configs.map(config => config.cache)
    });
  }
  const compiler = new _Compiler.Compiler(args, reporter, cliConfig.root, cliConfig.reactNativePath);
  const {
    createServer
  } = await import('@callstack/repack-dev-server');
  const {
    start,
    stop
  } = await createServer({
    options: {
      ...devServerOptions,
      host: '0.0.0.0',
      rootDir: cliConfig.root,
      logRequests: showHttpRequests,
      devMiddleware
    },
    delegate: ctx => {
      if (args.interactive) {
        (0, _index3.setupInteractions)({
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
            void (0, _index3.runAdbReverse)({
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
        void (0, _index3.runAdbReverse)({
          logger: ctx.log,
          port: ctx.options.port,
          wait: true
        });
      }
      compiler.on('watchRun', ({
        platform
      }) => {
        console.log('[CompilerPlugin] hook: watchRun');
        ctx.notifyBuildStart(platform);
        ctx.broadcastToHmrClients({
          action: 'compiling',
          body: {
            name: platform
          }
        });
        if (platform === 'android') {
          void (0, _index3.runAdbReverse)({
            port: ctx.options.port,
            logger: ctx.log
          });
        }
      });
      compiler.on('invalid', ({
        platform
      }) => {
        console.log('[CompilerPlugin] hook: invalid');
        ctx.notifyBuildStart(platform);
        ctx.broadcastToHmrClients({
          action: 'compiling',
          body: {
            name: platform
          }
        });
      });
      compiler.on('done', ({
        platform,
        stats
      }) => {
        console.log('[CompilerPlugin] hook: done');
        ctx.notifyBuildEnd(platform);
        ctx.broadcastToHmrClients({
          action: 'hash',
          body: {
            name: platform,
            hash: stats.hash
          }
        });
        ctx.broadcastToHmrClients({
          action: 'ok',
          body: {
            name: platform
          }
        });
      });
      return {
        compiler: {
          getAsset: (url, platform, sendProgress) => {
            const {
              resourcePath
            } = (0, _index3.parseUrl)(url, platforms);
            return compiler.getSource(resourcePath, platform, sendProgress);
          },
          getMimeType: filename => {
            return (0, _index3.getMimeType)(filename);
          },
          inferPlatform: url => {
            const {
              platform
            } = (0, _index3.parseUrl)(url, platforms);
            return platform;
          }
        },
        devTools: {
          resolveProjectPath: filepath => {
            return (0, _index3.resolveProjectPath)(filepath, cliConfig.root);
          }
        },
        symbolicator: {
          getSource: url => {
            let {
              resourcePath,
              platform
            } = (0, _index3.parseUrl)(url, platforms);
            resourcePath = (0, _index3.resolveProjectPath)(resourcePath, cliConfig.root);
            return compiler.getSource(resourcePath, platform);
          },
          getSourceMap: url => {
            const {
              resourcePath,
              platform
            } = (0, _index3.parseUrl)(url, platforms);
            return compiler.getSourceMap(resourcePath, platform);
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
            const logEntry = (0, _index2.makeLogEntryFromFastifyLog)(log);
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
    const sendEventsPath = _path.default.join(cliConfig.root, sendEventsArg);
    const {
      default: sendEvents
    } = await import(sendEventsPath);
    sendEventsStop = await sendEvents(cliConfig.root);
  }
  return {
    stop: async () => {
      reporter.stop();
      sendEventsStop();
      await stop();
    }
  };
}