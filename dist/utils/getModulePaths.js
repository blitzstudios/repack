"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getModulePaths = getModulePaths;
/**
 * Generates regular expressions for matching module paths in both classic (npm, yarn) and exotic (pnpm) formats.
 *
 * In classic paths, the module names are escaped to match both forward slashes and backslashes.
 * In exotic paths, the module names' forward or backward slashes are replaced with `+`.
 *
 * @param moduleNames The name of the modules to generate paths for.
 * @returns An array of RegExp objects.
 *
 * @category Webpack util
 *
 * @example Usage in Webpack config:
 * ```ts
 * import * as Repack from '@callstack/repack';
 *
 * return {
 *   ...,
 *   module: {
 *     rules: [
 *       ...,
 *       include: [
 *         ...Repack.getModulePaths([
 *            'react-native',
 *            '@react-native',
 *            'react-native-macos',
 *            'react-native-windows',
 *            'react-native-tvos',
 *            '@callstack/react-native-visionos',
 *            ...
 *         ]),
 *       ],
 *     ]
 *   }
 * }
 * ```
 */
function getModulePaths(moduleNames) {
  return moduleNames.flatMap(moduleName => {
    const escapedClassic = moduleName.replace(/[/\\]/g, '[/\\\\]');
    const escapedExotic = moduleName.replace(/[/\\]/g, '\\+');
    const classicPath = new RegExp(`node_modules([/\\\\])+${escapedClassic}[/\\\\]`);
    const exoticPath = new RegExp(`node_modules(.*[/\\\\])+${escapedExotic}[@\\+]`);
    return [classicPath, exoticPath];
  });
}