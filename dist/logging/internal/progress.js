"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Spinner = exports.IS_SYMBOL_SUPPORTED = void 0;
exports.buildDoneMessageParts = buildDoneMessageParts;
exports.buildInProgressMessageParts = buildInProgressMessageParts;
exports.colorizePlatformLabel = colorizePlatformLabel;
exports.formatElapsed = formatElapsed;
exports.formatSecondsOneDecimal = formatSecondsOneDecimal;
exports.renderProgressBar = renderProgressBar;
var colorette = _interopRequireWildcard(require("colorette"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const IS_SYMBOL_SUPPORTED = exports.IS_SYMBOL_SUPPORTED = process.platform !== 'win32' || Boolean(process.env.CI) || process.env.TERM === 'xterm-256color';
function colorizePlatform(text, platform) {
  if (!platform) return colorette.green(text);
  const p = platform.toLowerCase();
  if (p.includes('ios')) return colorette.blue(text);
  if (p.includes('android')) return colorette.green(text);
  return colorette.green(text);
}
function renderProgressBar(percentage, {
  width = 16,
  platform,
  unicode = IS_SYMBOL_SUPPORTED
} = {}) {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
  const filled = Math.round(clamped / 100 * width);
  const empty = Math.max(0, width - filled);
  const fullChar = unicode ? '=' : '#';
  const emptyChar = unicode ? '-' : '.';
  const filledStrColored = colorizePlatform(fullChar.repeat(filled), platform);
  const emptyStr = emptyChar.repeat(empty);
  return `[${filledStrColored}${emptyStr}]`;
}
function colorizePlatformLabel(platform, label) {
  const p = platform.toLowerCase();
  if (p.includes('ios')) return colorette.blue(label);
  if (p.includes('android')) return colorette.green(label);
  return label;
}
class Spinner {
  index = 0;
  getNext() {
    const frames = IS_SYMBOL_SUPPORTED ? ['⠋', '⠙', '⠸', '⠴', '⠦', '⠇'] : ['-', '\\', '|', '/'];
    const frame = frames[this.index % frames.length];
    this.index += 1;
    return frame;
  }
}
exports.Spinner = Spinner;
function formatSecondsOneDecimal(ms) {
  return `${(ms / 1000).toFixed(1)}s`;
}
function formatElapsed(start, now) {
  const ms = Math.max(0, now - start);
  if (ms < 1000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60_000);
  const seconds = Math.floor(ms % 60_000 / 1000).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
function buildInProgressMessageParts(platform, percentage, options = {}) {
  const {
    width = 16,
    maxPlatformNameWidth = platform.length
  } = options;
  const bar = renderProgressBar(percentage, {
    width,
    platform
  });
  const percentText = `${Math.floor(percentage).toString().padStart(3, ' ')}%`;
  const barAndPercent = `${bar}${percentText}`;
  const platformPadded = platform.padEnd(maxPlatformNameWidth, ' ');
  const platformColored = colorizePlatformLabel(platform, platformPadded);
  return [barAndPercent, platformColored];
}
function buildDoneMessageParts(platform, timeMs, options = {}) {
  const {
    maxPlatformNameWidth = platform.length
  } = options;
  const platformPadded = platform.padEnd(maxPlatformNameWidth, ' ');
  const platformColored = colorizePlatformLabel(platform, platformPadded);
  const timeColored = colorizePlatformLabel(platform, formatSecondsOneDecimal(timeMs));
  return ['Compiled', platformColored, 'in', timeColored];
}