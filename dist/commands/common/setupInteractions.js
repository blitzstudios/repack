"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupInteractions = setupInteractions;
var _nodeReadline = _interopRequireDefault(require("node:readline"));
var colorette = _interopRequireWildcard(require("colorette"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function setupInteractions(handlers, options) {
  const logger = options?.logger ?? console;
  const process = options?.process ?? global.process;
  const readline = options?.readline ?? _nodeReadline.default;
  if (!process.stdin.setRawMode) {
    logger.warn('Interactive mode is not supported in this environment');
    return;
  }
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  // graceful shutdown
  process.on('SIGINT', () => {
    process.exit();
  });
  process.stdin.on('keypress', (_key, data) => {
    const {
      ctrl,
      name
    } = data;
    if (ctrl === true) {
      switch (name) {
        case 'c':
          process.emit('SIGINT', 'SIGINT');
          break;
        case 'z':
          process.emit('SIGTSTP', 'SIGTSTP');
          break;
      }
    } else {
      const interaction = plainInteractions[name];
      if (interaction) {
        const {
          action,
          postPerformMessage,
          helpName,
          actionUnsupportedExplanation
        } = interaction;
        if (action && actionUnsupportedExplanation === undefined) {
          logger.info(postPerformMessage);
          action();
        } else {
          logger.warn(`${helpName} is not supported ${actionUnsupportedExplanation ?? 'by the used bundler'}`);
        }
      }
    }
  });
  const plainInteractions = {
    r: {
      action: handlers.onReload,
      postPerformMessage: 'Reloading app',
      helpName: 'Reload app'
    },
    d: {
      action: handlers.onOpenDevMenu,
      postPerformMessage: 'Opening developer menu',
      helpName: 'Open developer menu'
    },
    j: {
      action: handlers.onOpenDevTools,
      postPerformMessage: 'Opening debugger',
      helpName: 'Open debugger'
    },
    a: {
      action: handlers.onAdbReverse,
      postPerformMessage: 'Running adb reverse',
      helpName: 'Run adb reverse'
    }
  };

  // use process.stdout for sync output at startup
  for (const [key, interaction] of Object.entries(plainInteractions)) {
    const isSupported = interaction?.actionUnsupportedExplanation === undefined && interaction?.action !== undefined;
    const text = ` ${colorette.bold(key)}: ${interaction?.helpName}${isSupported ? '' : colorette.yellow(` (unsupported${interaction?.actionUnsupportedExplanation ? `, ${interaction.actionUnsupportedExplanation}` : ' by the current bundler'})`)}\n`;
    process.stdout.write(isSupported ? text : colorette.italic(text));
  }
  process.stdout.write('\nPress Ctrl+c or Ctrl+z to quit the dev server\n\n');
}