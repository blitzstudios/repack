"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startCommandOptions = exports.bundleCommandOptions = void 0;
var _nodePath = _interopRequireDefault(require("node:path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const startCommandOptions = exports.startCommandOptions = [{
  name: '--port <number>',
  description: 'The port number that runs the server on',
  parse: val => Number(val)
}, {
  name: '--host <string>',
  description: 'Set the server host',
  default: ''
}, {
  name: '--https',
  description: 'Enables https connections to the server'
}, {
  name: '--key <path>',
  description: 'Path to custom SSL key'
}, {
  name: '--cert <path>',
  description: 'Path to custom SSL cert'
}, {
  name: '--no-interactive',
  description: 'Disables interactive mode'
},
// noop, but kept for compatibility
{
  name: '--reset-cache, --resetCache'
},
// options specific to Re.Pack
{
  name: '--json',
  description: 'Log all messages to the console/stdout in JSON format'
}, {
  name: '--log-file <path>',
  description: 'Enables file logging to specified file',
  parse: val => _nodePath.default.resolve(val)
}, {
  name: '--send-events <string>',
  description: 'Send packager events to a listener'
}, {
  name: '--log-requests',
  description: 'Enables logging of all requests to the server'
}, {
  name: '--platform <string>',
  description: 'Run the dev server for the specified platform only. By default, the dev server will bundle for all platforms.'
}, {
  name: '--reverse-port',
  description: 'ADB reverse port on starting devServers only for Android'
}, {
  name: '--verbose',
  description: 'Enables verbose logging'
}, {
  name: '--config <path>',
  description: 'Path to a bundler config file, e.g webpack.config.js',
  parse: val => _nodePath.default.resolve(val)
}, {
  name: '--webpackConfig <path>',
  description: 'Path to a bundler config file, e.g webpack.config.js',
  parse: val => _nodePath.default.resolve(val)
}];
const bundleCommandOptions = exports.bundleCommandOptions = [{
  name: '--entry-file <path>',
  description: 'Path to the root JS file, either absolute or relative to JS root'
}, {
  name: '--platform <string>',
  description: 'Either "ios" or "android"',
  default: 'ios'
}, {
  name: '--dev [boolean]',
  description: 'Enables development warnings and disables production optimisations',
  parse: val => val !== 'false',
  default: true
}, {
  name: '--minify [boolean]',
  description: 'Allows overriding whether bundle is minified. This defaults to ' + 'false if dev is true, and true if dev is false. Disabling minification ' + 'can be useful for speeding up production builds for testing purposes.',
  parse: val => val !== 'false'
}, {
  name: '--bundle-output <string>',
  description: 'File name where to store the resulting bundle, ex. /tmp/groups.bundle'
}, {
  name: '--sourcemap-output <string>',
  description: 'File name where to store the sourcemap file for resulting bundle, ex. /tmp/groups.map'
}, {
  name: '--assets-dest <string>',
  description: 'Directory name where to store assets referenced in the bundle'
},
// noop, but kept for compatibility
{
  name: '--reset-cache'
},
// options specific to Re.Pack
{
  name: '--json <statsFile>',
  description: 'Stores stats in a file.',
  parse: val => _nodePath.default.resolve(val)
}, {
  name: '--stats <preset>',
  description: 'It instructs Webpack on how to treat the stats:\n' + "'errors-only'  - only output when errors happen\n" + "'errors-warnings' - only output errors and warnings happen\n" + "'minimal' - only output when errors or new compilation happen\n" + "'none' - output nothing\n" + "'normal' - standard output\n" + "'verbose' - output everything\n" + "'detailed' - output everything except chunkModules and chunkRootModules\n" + "'summary' - output webpack version, warnings count and errors count"
}, {
  name: '--verbose',
  description: 'Enables verbose logging'
}, {
  name: '--watch',
  description: 'Watch for file changes'
}, {
  name: '--config <path>',
  description: 'Path to a bundler config file, e.g webpack.config.js',
  parse: val => _nodePath.default.resolve(val)
}, {
  name: '--webpackConfig <path>',
  description: '[DEPRECATED] Path to a bundler config file, e.g webpack.config.js. Please use --config instead.',
  parse: val => _nodePath.default.resolve(val)
}];
//# sourceMappingURL=options.js.map