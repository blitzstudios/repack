import type { Rule } from '../../types';

/**
 * Matching options to check if given {@link DestinationConfig} should be used.
 */
export type DestinationMatchRules = {
  /**
   * Rule (string or RegExp) that must match the chunk name (or id if name is not available),
   * for the whole `DestinationMatchRules` to match.
   */
  test?: Rule | Rule[];

  /**
   * Rule (string or RegExp) that must match the chunk name (or id if name is not available),
   * for the whole `DestinationMatchRules` to match.
   */
  include?: Rule | Rule[];

  /**
   * Rule (string or RegExp) that __MUST NOT__ match the chunk name (or id if name is not available),
   * for the whole `DestinationMatchRules` to match.
   */
  exclude?: Rule | Rule[];
};

/**
 * Destination config for local chunks.
 */
export type LocalDestinationConfig = {
  type: 'local';
};

/**
 * Destination config for remote chunks.
 */
export type RemoteDestinationConfig = {
  type: 'remote';

  /** Output path to a directory, where remote chunks should be saved. */
  outputPath: string;
};

/**
 * Destination config for chunks.
 */
export type DestinationConfig =
  | LocalDestinationConfig
  | RemoteDestinationConfig;

/**
 * Destination specification for chunks.
 */
export type DestinationSpec = DestinationMatchRules & DestinationConfig;

/**
 * {@link OutputPlugin} configuration options.
 */
export interface OutputPluginConfig {
  /** Context in which all resolution happens. Usually it's project root directory. */
  context: string;

  /** Target application platform. */
  platform: string;

  /**
   * Whether the plugin is enabled. Defaults to `true`.
   *
   * Useful when running with development server, in which case, it's not necessary for this plugin
   * to be enabled.
   */
  enabled?: boolean;

  /** The entry chunk name, `main` by default. */
  entryName?: string;

  /**
   * Output options specifying where to save generated bundle, source map and assets.
   */
  output: {
    /** Bundle output filename - name under which generated bundle will be saved. */
    bundleFilename?: string;

    /**
     * Source map filename - name under which generated source map (for the main bundle) will be saved.
     */
    sourceMapFilename?: string;

    /** Assets output path - directory where generated static assets will be saved. */
    assetsPath?: string;

    /**
     * Auxiliary assets output path - directory where generated auxiliary assets will be saved
     *
     * Useful when working with remote-assets generated by assetsLoader
     * */
    auxiliaryAssetsPath?: string;
  };

  /**
   * Options specifying how to deal with extra chunks generated in the compilation,
   * usually by using dynamic `import(...)` function.
   *
   * By default all extra chunks will be saved under `<projectRoot>/build/outputs/<platform>/remotes` directory.
   *
   * __Specifying custom value for this option, will disable default setting - you will need
   * to configure `outputPath` for `type: 'remote'` yourself.__
   *
   * If you want to have some of the chunks available inside the `.ipa`/`.apk` file generated by React Native,
   * you must configure this options to match the chunks you want (using `test`/`include`/`exclude`)
   * and set the `type` to `local`, for example:
   * ```ts
   * new OutputPlugin({
   *   context,
   *   platform,
   *   output,
   *   extraChunks: [
   *     {
   *       // Make `my-chunk` local
   *       include: /my-chunk/,
   *       type: 'local',
   *     },
   *     {
   *       // Make any other chunk remote
   *       exclude: /my-chunk/,
   *       type: 'remote',
   *       outputPath,
   *     },
   *   ]
   * });
   * ```
   */
  extraChunks?: DestinationSpec[];
}
