import type { SwcLoaderOptions } from '@rspack/core';
export declare function getSupportedSwcNormalTransforms(transforms: [string, Record<string, any> | undefined][]): string[];
export declare function getSupportedSwcConfigurableTransforms(transforms: [string, Record<string, any> | undefined][], swcConfig: SwcLoaderOptions): {
    swcConfig: SwcLoaderOptions;
    transformNames: string[];
};
export declare function getSupportedSwcCustomTransforms(transforms: [string, Record<string, any> | undefined][], swcConfig: SwcLoaderOptions): {
    swcConfig: SwcLoaderOptions;
    transformNames: string[];
};
