"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Symbolicator = void 0;

var _url = require("url");

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _util = require("util");

var _codeFrame = require("@babel/code-frame");

var _sourceMap = require("source-map");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const readFileAsync = (0, _util.promisify)(_fs.default.readFile);
/**
 * Raw React Native stack frame.
 */

/**
 * Class for transforming stack traces from React Native application with using Source Map.
 * Raw stack frames produced by React Native, points to some location from the bundle
 * eg `index.bundle?platform=ios:567:1234`. By using Source Map for that bundle `Symbolicator`
 * produces frames that point to source code inside your project eg `Hello.tsx:10:9`.
 */
class Symbolicator {
  /**
   * Infer platform from stack frames.
   * Usually at least one frame has `file` field with the bundle URL eg:
   * `http://localhost:8081/index.bundle?platform=ios&...`, which can be used to infer platform.
   *
   * @param stack Array of stack frames.
   * @returns Inferred platform or `undefined` if cannot infer.
   */
  static inferPlatformFromStack(stack) {
    for (const frame of stack) {
      if (!frame.file) {
        return;
      }

      const {
        searchParams,
        pathname
      } = new _url.URL(frame.file, 'file://');
      const platform = searchParams.get('platform');

      if (platform) {
        return platform;
      } else {
        const [bundleFilename] = pathname.split('/').reverse();
        const [, platformOrExtension, extension] = bundleFilename.split('.');

        if (extension) {
          return platformOrExtension;
        }
      }
    }
  }
  /**
   * Cache with initialized `SourceMapConsumer` to improve symbolication performance.
   */


  /**
   * Constructs new `Symbolicator` instance.
   *
   * @param projectRoot Absolute path to root directory of the project.
   * @param logger Fastify logger instance.
   * @param readFileFromWdm Function to read arbitrary file from webpack-dev-middleware.
   * @param readSourceMapFromWdm Function to read Source Map file from webpack-dev-middleware.
   */
  constructor(projectRoot, logger, readFileFromWdm, readSourceMapFromWdm) {
    this.projectRoot = projectRoot;
    this.logger = logger;
    this.readFileFromWdm = readFileFromWdm;
    this.readSourceMapFromWdm = readSourceMapFromWdm;

    _defineProperty(this, "sourceMapConsumerCache", {});
  }
  /**
   * Process raw React Native stack frames and transform them using Source Maps.
   * Method will try to symbolicate as much data as possible, but if the Source Maps
   * are not available, invalid or the original positions/data is not found in Source Maps,
   * the method will return raw values - the same as supplied with `stack` parameter.
   * For example out of 10 frames, it's possible that only first 7 will be symbolicated and the
   * remaining 3 will be unchanged.
   *
   * @param stack Raw stack frames.
   * @returns Symbolicated stack frames.
   */


  async process(stack) {
    // TODO: add debug logging
    const frames = [];

    for (const frame of stack) {
      const {
        file
      } = frame;

      if (file !== null && file !== void 0 && file.startsWith('http') && !file.includes('debuggerWorker')) {
        frames.push(frame);
      }
    }

    try {
      var _await$this$getCodeFr;

      const processedFrames = [];

      for (const frame of frames) {
        if (!this.sourceMapConsumerCache[frame.file]) {
          const rawSourceMap = await this.readSourceMapFromWdm(frame.file);
          const sourceMapConsumer = await new _sourceMap.SourceMapConsumer(rawSourceMap);
          this.sourceMapConsumerCache[frame.file] = sourceMapConsumer;
        }

        const processedFrame = this.processFrame(frame);
        processedFrames.push(processedFrame);
      }

      return {
        stack: processedFrames,
        codeFrame: (_await$this$getCodeFr = await this.getCodeFrame(processedFrames)) !== null && _await$this$getCodeFr !== void 0 ? _await$this$getCodeFr : null
      };
    } finally {
      for (const key in this.sourceMapConsumerCache) {
        this.sourceMapConsumerCache[key].destroy();
        delete this.sourceMapConsumerCache[key];
      }
    }
  }

  processFrame(frame) {
    if (!frame.lineNumber || !frame.column) {
      return { ...frame,
        collapse: false
      };
    }

    const consumer = this.sourceMapConsumerCache[frame.file];

    if (!consumer) {
      return { ...frame,
        collapse: false
      };
    }

    const lookup = consumer.originalPositionFor({
      line: frame.lineNumber,
      column: frame.column
    }); // If lookup fails, we get the same shape object, but with
    // all values set to null

    if (!lookup.source) {
      // It is better to gracefully return the original frame
      // than to throw an exception
      return { ...frame,
        collapse: false
      };
    }

    return {
      lineNumber: lookup.line || frame.lineNumber,
      column: lookup.column || frame.column,
      file: lookup.source,
      methodName: lookup.name || frame.methodName,
      collapse: false
    };
  }

  async getCodeFrame(processedFrames) {
    for (const frame of processedFrames) {
      if (frame.collapse || !frame.lineNumber || !frame.column) {
        continue;
      } // If the frame points to internal bootstrap/module system logic, skip the code frame.


      if (/webpack[/\\]runtime[/\\].+\s/.test(frame.file)) {
        return undefined;
      }

      try {
        let filename;
        let source;

        if (frame.file.startsWith('http') && frame.file.includes('index.bundle')) {
          // Frame points to the bundle so we need to read bundle from WDM's FS.
          filename = frame.file;
          source = await this.readFileFromWdm('/index.bundle');
        } else {
          filename = _path.default.join(this.projectRoot, frame.file.replace('webpack://', ''));
          source = await readFileAsync(filename, 'utf8');
        }

        return {
          content: (0, _codeFrame.codeFrameColumns)(source, {
            start: {
              column: frame.column,
              line: frame.lineNumber
            }
          }, {
            forceColor: true
          }),
          location: {
            row: frame.lineNumber,
            column: frame.column
          },
          fileName: filename
        };
      } catch (error) {
        this.logger.error({
          msg: 'Failed to create code frame',
          error: error.message
        });
      }

      return undefined;
    }
  }

}

exports.Symbolicator = Symbolicator;
//# sourceMappingURL=Symbolicator.js.map