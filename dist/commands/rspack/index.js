"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _options = require("../options.js");
var _bundle = require("./bundle.js");
var _start = require("./start.js");
const commands = [{
  name: 'bundle',
  description: 'Build the bundle for the provided JavaScript entry file.',
  options: _options.bundleCommandOptions,
  func: _bundle.bundle
}, {
  name: 'webpack-bundle',
  description: 'Build the bundle for the provided JavaScript entry file.',
  options: _options.bundleCommandOptions,
  func: _bundle.bundle
}, {
  name: 'start',
  description: 'Start the React Native development server.',
  options: _options.startCommandOptions,
  func: _start.start
}, {
  name: 'webpack-start',
  description: 'Start the React Native development server.',
  options: _options.startCommandOptions,
  func: _start.start
}];
var _default = exports.default = commands;