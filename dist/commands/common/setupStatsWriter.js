"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeStatsOptions = normalizeStatsOptions;
exports.writeStats = writeStats;
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _promises = require("node:stream/promises");
var _jsonExt = require("@discoveryjs/json-ext");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function normalizeFilepath(filepath, root) {
  if (_nodePath.default.isAbsolute(filepath)) {
    return filepath;
  }
  return _nodePath.default.resolve(root, filepath);
}
function ensureFilepathExists(filepath) {
  _nodeFs.default.mkdirSync(_nodePath.default.dirname(filepath), {
    recursive: true
  });
}
function normalizeStatsOptions(options, preset) {
  if (preset !== undefined) {
    return {
      preset: preset
    };
  }
  if (options === true) {
    return {
      preset: 'normal'
    };
  }
  if (options === false) {
    return {
      preset: 'none'
    };
  }
  return options;
}
async function writeStats(stats, {
  filepath,
  logger = console,
  rootDir
}) {
  const outputPath = normalizeFilepath(filepath, rootDir);
  logger.info('Writing compiler stats');

  // Stats can be fairly big at which point their JSON no longer fits into a single string.
  // Approach was copied from `webpack-cli`: https://github.com/webpack/webpack-cli/blob/c03fb03d0aa73d21f16bd9263fd3109efaf0cd28/packages/webpack-cli/src/webpack-cli.ts#L2471-L2482
  const statsStream = (0, _jsonExt.stringifyStream)(stats);
  ensureFilepathExists(outputPath);
  const outputStream = _nodeFs.default.createWriteStream(outputPath);
  await (0, _promises.pipeline)(statsStream, outputStream);
  logger.info(`Wrote compiler stats to ${outputPath}`);
}