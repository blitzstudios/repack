# Class: ChunksToHermesBytecodePlugin

[plugins](../modules/plugins.md).ChunksToHermesBytecodePlugin

Enable Hermes bytecode compilation for the given chunks.
This plugin is intended to be used with the `webpack-bundle` command.
It will transform the bundle into Hermes bytecode and replace the original bundle with the bytecode.
It will also compose the source maps generated by webpack and Hermes.

Note: This plugin should only be used for production builds.
It is not possible to use this plugin for development builds.

Note: You should exclude `index.bundle` from being transformed.
The `index.bundle` file is transformed by `react-native` after enabling Hermes in your project.

**`example`** ```js
// webpack.config.mjs
import * as Repack from '@callstack/repack';

// ...
plugins: [
  new Repack.ChunksToHermesBytecodePlugin({
   enabled: mode === 'production' && !devServer,
   test: /\.(js)?bundle$/,
   exclude: /index.bundle$/,
  }),
]
```

@category Webpack Plugin

## Implements

- [`WebpackPlugin`](../interfaces/WebpackPlugin.md)

## Table of contents

### Constructors

- [constructor](./plugins.ChunksToHermesBytecodePlugin.md#constructor)

### Methods

- [apply](./plugins.ChunksToHermesBytecodePlugin.md#apply)

## Constructors

### constructor

• **new ChunksToHermesBytecodePlugin**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `ChunksToHermesBytecodePluginConfig` |

#### Defined in

[packages/repack/src/webpack/plugins/ChunksToHermesBytecodePlugin/ChunksToHermesBytecodePlugin.ts:76](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/ChunksToHermesBytecodePlugin/ChunksToHermesBytecodePlugin.ts#L76)

## Methods

### apply

▸ **apply**(`compiler`): `void`

Entry point for a plugin. It should perform any kind of setup or initialization
hook into compiler's events.

#### Parameters

| Name | Type |
| :------ | :------ |
| `compiler` | `Compiler` |

#### Returns

`void`

#### Implementation of

[WebpackPlugin](../interfaces/WebpackPlugin.md).[apply](../interfaces/WebpackPlugin.md#apply)

#### Defined in

[packages/repack/src/webpack/plugins/ChunksToHermesBytecodePlugin/ChunksToHermesBytecodePlugin.ts:78](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/ChunksToHermesBytecodePlugin/ChunksToHermesBytecodePlugin.ts#L78)
