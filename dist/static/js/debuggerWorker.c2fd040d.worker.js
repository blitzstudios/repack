/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*********************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[1]!./src/debuggerWorker.js ***!
  \*********************************************************************************************/
__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* global __fbBatchedBridge, importScripts */

/* eslint no-unused-vars: 0 */

/* eslint no-restricted-globals: 0 */
onmessage = function () {
  var visibilityState;

  var showVisibilityWarning = function () {
    var hasWarned = false;
    return function () {
      // Wait until `YellowBox` gets initialized before displaying the warning.
      if (hasWarned || console.warn.toString().includes('[native code]')) {
        return;
      }

      hasWarned = true;
      console.warn('Remote debugger is in a background tab which may cause apps to ' + 'perform slowly. Fix this by foregrounding the tab (or opening it in ' + 'a separate window).');
    };
  }();

  var messageHandlers = {
    executeApplicationScript: function executeApplicationScript(message, sendReply) {
      for (var key in message.inject) {
        self[key] = JSON.parse(message.inject[key]);
      }

      var error;

      try {
        importScripts(message.url);
      } catch (err) {
        error = err.message;
      }

      sendReply(null
      /* result */
      , error);
    },
    setDebuggerVisibility: function setDebuggerVisibility(message) {
      visibilityState = message.visibilityState;
    }
  };
  return function (message) {
    if (visibilityState === 'hidden') {
      showVisibilityWarning();
    }

    var object = message.data;

    var sendReply = function sendReply(result, error) {
      postMessage({
        replyID: object.id,
        result: result,
        error: error
      });
    };

    var handler = messageHandlers[object.method];

    if (handler) {
      // Special cased handlers
      handler(object, sendReply);
    } else {
      // Other methods get called on the bridge
      var returnValue = [[], [], [], 0];
      var error;

      try {
        if ((typeof __fbBatchedBridge === "undefined" ? "undefined" : _typeof(__fbBatchedBridge)) === 'object') {
          returnValue = __fbBatchedBridge[object.method].apply(null, object.arguments);
        } else {
          error = 'Failed to call function, __fbBatchedBridge is undefined';
        }
      } catch (err) {
        error = err.message;
      } finally {
        sendReply(JSON.stringify(returnValue), error);
      }
    }
  };
}();
/******/ })()
;
//# sourceMappingURL=debuggerWorker.c2fd040d.worker.js.map