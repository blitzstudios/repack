import type { LoaderContext } from '@rspack/core';
export declare const raw = false;
/**
 * This loader is used in Webpack configuration as a fallback loader for 'builtin:react-refresh-loader' from Rspack.
 * Thanks to this loader, which mimics the one written in Rust, we can utilize "@rspack/plugin-react-refresh" in Webpack as well,
 * instead of relying on "@pmmmwh/react-refresh-webpack-plugin".
 *
 * Reference implementation: https://github.com/web-infra-dev/rspack/blob/main/crates/rspack_loader_react_refresh/src/lib.rs
 */
export default function reactRefreshCompatLoader(this: LoaderContext, originalSource: string, sourceMap: any, meta: any): void;
