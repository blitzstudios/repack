"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;

var _readline = _interopRequireDefault(require("readline"));

var _url = require("url");

var _execa = _interopRequireDefault(require("execa"));

var _env = require("../env");

var _logging = require("../logging");

var _Compiler = require("../webpack/Compiler");

var _getWebpackConfigPath = require("./utils/getWebpackConfigPath");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Start command for React Native CLI.
 * It runs `@callstack/repack-dev-server` to provide Development Server functionality to React Native apps
 * in development mode.
 *
 * @param _ Original, non-parsed arguments that were provided when running this command.
 * @param config React Native CLI configuration object.
 * @param args Parsed command line arguments.
 *
 * @internal
 * @category CLI command
 */
async function start(_, config, args) {
  const webpackConfigPath = (0, _getWebpackConfigPath.getWebpackConfigPath)(config.root, args.webpackConfig);
  const {
    reversePort: reversePortArg,
    ...restArgs
  } = args;
  const cliOptions = {
    config: {
      root: config.root,
      reactNativePath: config.reactNativePath,
      webpackConfigPath
    },
    command: 'start',
    arguments: {
      // `platform` is empty, since it will be filled in later by `DevServerProxy`
      start: { ...restArgs,
        platform: ''
      }
    }
  };
  const reversePort = reversePortArg ?? process.argv.includes('--reverse-port');
  const isSilent = args.silent;
  const isVerbose = isSilent ? false : args.verbose ?? process.argv.includes('--verbose');
  const reporter = (0, _logging.composeReporters)([new _logging.ConsoleReporter({
    asJson: args.json,
    level: isSilent ? 'silent' : isVerbose ? 'verbose' : 'normal'
  }), args.logFile ? new _logging.FileReporter({
    filename: args.logFile
  }) : undefined].filter(Boolean));
  const compiler = new _Compiler.Compiler(cliOptions, reporter, isVerbose);
  const {
    createServer
  } = await import('@callstack/repack-dev-server');
  const {
    start,
    stop
  } = await createServer({
    options: {
      rootDir: cliOptions.config.root,
      host: args.host,
      port: args.port ?? _env.DEFAULT_PORT,
      https: args.https ? {
        cert: args.cert,
        key: args.key
      } : undefined
    },
    delegate: ctx => {
      if (args.interactive) {
        bindKeypressInput(ctx);
      }

      if (reversePort && args.port) {
        runAdbReverse(ctx, args.port);
      }

      let lastStats;
      compiler.on('watchRun', ({
        platform
      }) => {
        ctx.notifyBuildStart(platform);

        if (platform === 'android') {
          runAdbReverse(ctx, args.port ?? _env.DEFAULT_PORT);
        }
      });
      compiler.on('invalid', ({
        platform
      }) => {
        ctx.notifyBuildStart(platform);
        ctx.broadcastToHmrClients({
          action: 'building'
        }, platform);
      });
      compiler.on('done', ({
        platform,
        stats
      }) => {
        ctx.notifyBuildEnd(platform);
        lastStats = stats;
        ctx.broadcastToHmrClients({
          action: 'built',
          body: createHmrBody(stats)
        }, platform);
      });
      return {
        compiler: {
          getAsset: async (filename, platform, sendProgress) => (await compiler.getAsset(filename, platform, sendProgress)).data,
          getMimeType: filename => compiler.getMimeType(filename),
          inferPlatform: uri => {
            const url = new _url.URL(uri, 'protocol://domain');

            if (!url.searchParams.get('platform')) {
              const [, platform] = /^\/(.+)\/.+$/.exec(url.pathname) ?? [];
              return platform;
            }

            return undefined;
          }
        },
        symbolicator: {
          getSource: fileUrl => {
            const {
              filename,
              platform
            } = parseFileUrl(fileUrl);
            return compiler.getSource(filename, platform);
          },
          getSourceMap: fileUrl => {
            const {
              filename,
              platform
            } = parseFileUrl(fileUrl);

            if (!platform) {
              throw new Error('Cannot infer platform for file URL');
            }

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
              body: createHmrBody(lastStats)
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
          getPlatforms: async () => Object.keys(compiler.workers),
          getAssets: async platform => Object.entries(compiler.assetsCache[platform] ?? {}).map(([name, asset]) => ({
            name,
            size: asset.info.size
          })),
          getCompilationStats: async platform => compiler.statsCache[platform] ?? null
        }
      };
    }
  });
  await start();
  return {
    stop: async () => {
      reporter.stop();
      await stop();
    }
  };
}

function bindKeypressInput(ctx) {
  if (!process.stdin.setRawMode) {
    ctx.log.warn({
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
      ctx.broadcastToMessageClients({
        method: 'reload'
      });
      ctx.log.info({
        msg: 'Reloading app'
      });
    } else if (name === 'd') {
      ctx.broadcastToMessageClients({
        method: 'devMenu'
      });
      ctx.log.info({
        msg: 'Opening developer menu'
      });
    }
  });
}

async function runAdbReverse(ctx, port) {
  const adbPath = process.env.ANDROID_HOME ? `${process.env.ANDROID_HOME}/platform-tools/adb` : 'adb';
  const command = `${adbPath} reverse tcp:${port} tcp:${port}`;

  try {
    await _execa.default.command(command);
    ctx.log.info(`Successfully run: ${command}`);
  } catch (error) {
    // Get just the error message
    const message = error.message.split('error:')[1] || error.message;
    ctx.log.warn(`Failed to run: ${command} - ${message.trim()}`);
  }
}

function parseFileUrl(fileUrl) {
  const {
    pathname: filename,
    searchParams
  } = new _url.URL(fileUrl);
  let platform = searchParams.get('platform');

  if (!platform) {
    const [, platformOrName, name] = filename.split('.').reverse();

    if (name !== undefined) {
      platform = platformOrName;
    }
  }

  return {
    filename: filename.replace(/^\//, ''),
    platform: platform || undefined
  };
}

function createHmrBody(stats) {
  if (!stats) {
    return null;
  }

  const modules = {};

  for (const module of stats.modules ?? []) {
    const {
      identifier,
      name
    } = module;

    if (identifier !== undefined && name) {
      modules[identifier] = name;
    }
  }

  return {
    name: stats.name ?? '',
    time: stats.time ?? 0,
    hash: stats.hash ?? '',
    warnings: stats.warnings || [],
    errors: stats.errors || [],
    modules
  };
}
//# sourceMappingURL=start.js.map