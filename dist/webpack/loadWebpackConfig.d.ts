import webpack from 'webpack';
import { WebpackEnvOptions } from '../types';
export declare function loadWebpackConfig(webpackConfigPath: string, env: WebpackEnvOptions): Promise<webpack.Configuration>;
