"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readFileFromWdm = readFileFromWdm;

function readFileFromWdm(wdm, filename) {
  return new Promise((resolve, reject) => wdm.context.outputFileSystem.readFile(filename, (error, content) => {
    if (error || !content) {
      reject(error);
    } else {
      resolve(content);
    }
  }));
}
//# sourceMappingURL=readFileFromWdm.js.map