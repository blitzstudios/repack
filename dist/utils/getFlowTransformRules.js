"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFlowTransformRules = getFlowTransformRules;
var _getModulePaths = require("../utils/getModulePaths.js");
const FLOW_TYPED_MODULES = ['react-native', '@react-native', 'react-native-macos', 'react-native-windows', 'react-native-tvos', '@callstack/react-native-visionos', 'react-native-blob-util', 'react-native-pdf', '@react-native-picker/picker', 'react-native-config', 'react-native-fs', 'react-native-image-size', 'react-native-performance', 'react-native-vector-icons', '@react-native-community/datetimepicker', 'react-native-linear-gradient', 'react-native-inappbrowser-reborn', 'react-native-camera', 'react-native-view-shot', '@react-native-community/push-notification-ios', 'react-native-keyboard-aware-scroll-view', 'react-native-modal-datetime-picker'];

/**
 * Interface for {@link getFlowTransformRules} options.
 */

/**
 * Creates rules configuration for handling Flow type annotations in JavaScript files.
 * The rules will use flow-loader to remove Flow types from the code before other processing.
 *
 * @param options Configuration options
 * @param options.include Array of module names to include for Flow transformation (defaults to predefined FLOW_TYPED_MODULES)
 * @param options.exclude Array of module names to exclude from Flow transformation (defaults to empty array)
 * @param options.all If true, bypasses looking for @flow pragma comment before parsing (defaults to true)
 * @param options.ignoreUninitializedFields If true, removes uninitialized class fields completely rather than only removing the type (defaults to false)
 * @param options.removeEmptyImports If true, removes empty import statements which were only used for importing flow types (defaults to true)
 *
 * @returns Array of rules for transforming Flow typed modules
 */
function getFlowTransformRules({
  include = FLOW_TYPED_MODULES,
  exclude = [],
  all = true,
  ignoreUninitializedFields = false,
  removeEmptyImports = true
} = {}) {
  return [{
    type: 'javascript/auto',
    test: /\.(jsx?|flow)$/,
    include: (0, _getModulePaths.getModulePaths)(include),
    exclude: (0, _getModulePaths.getModulePaths)(exclude),
    use: {
      loader: '@callstack/repack/flow-loader',
      options: {
        all,
        ignoreUninitializedFields,
        removeEmptyImports
      }
    }
  }];
}