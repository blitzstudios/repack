import { describe, expect, test } from 'vitest';
import { setupTestEnvironment } from '../test-helpers.js';

describe('Package Exports Resolution', () => {
  test.fails(
    'should resolve ESM imports with react-native condition',
    async () => {
      const { resolve } = await setupTestEnvironment(['exports'], {
        platform: 'ios',
        enablePackageExports: true,
      });

      const result = await resolve('complex-lib', 'esm');
      expect(result).toBe('/node_modules/complex-lib/esm/index.native.js');
    }
  );

  test.fails(
    'should resolve CommonJS requires with react-native condition',
    async () => {
      const { resolve } = await setupTestEnvironment(['exports'], {
        platform: 'ios',
        enablePackageExports: true,
      });

      const result = await resolve('complex-lib', 'cjs');
      expect(result).toBe('/node_modules/complex-lib/cjs/index.native.js');
    }
  );

  test('should resolve utils subpath', async () => {
    const { resolve } = await setupTestEnvironment(['exports'], {
      platform: 'ios',
      enablePackageExports: true,
    });

    const esmResult = await resolve('complex-lib/utils', 'esm');
    expect(esmResult).toBe('/node_modules/complex-lib/esm/utils.js');

    const cjsResult = await resolve('complex-lib/utils', 'cjs');
    expect(cjsResult).toBe('/node_modules/complex-lib/cjs/utils.js');
  });

  test('should resolve react-native only exports', async () => {
    const { resolve } = await setupTestEnvironment(['exports'], {
      platform: 'ios',
      enablePackageExports: true,
    });

    const result = await resolve('complex-lib/native-only');
    expect(result).toBe('/node_modules/complex-lib/native-specific.js');
  });

  test.fails(
    'should resolve to native version for react-native condition',
    async () => {
      const { resolve } = await setupTestEnvironment(['react-strict-dom'], {
        platform: 'ios',
        enablePackageExports: true,
      });

      const esmResult = await resolve('react-strict-dom', 'esm');
      expect(esmResult).toBe(
        '/node_modules/react-strict-dom/dist/native/index.js'
      );

      const cjsResult = await resolve('react-strict-dom', 'cjs');
      expect(cjsResult).toBe(
        '/node_modules/react-strict-dom/dist/native/index.js'
      );
    }
  );

  test('should fail to resolve with package exports disabled', async () => {
    const { resolve } = await setupTestEnvironment(['react-strict-dom'], {
      platform: 'ios',
      enablePackageExports: false,
    });

    // When exports are disabled, it should fallback to main field (which doesn't exist)
    // and then resolve to index.js (which also doesn't exist in this case)
    const esmResult = await resolve('react-strict-dom', 'esm');
    expect(esmResult).toBe(null);

    const cjsResult = await resolve('react-strict-dom', 'cjs');
    expect(cjsResult).toBe(null);
  });
});
