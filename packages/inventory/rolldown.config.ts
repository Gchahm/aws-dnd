import { defineConfig } from 'rolldown';

// Disables tree-shaking for the given module patterns
const disableTreeShake = (patterns: RegExp[]) => ({
  name: 'disable-treeshake',
  transform: (code, id) => {
    if (patterns.some((p) => p.test(id))) {
      return { code, map: null, moduleSideEffects: 'no-treeshake' };
    }
    return null;
  },
});

export default defineConfig([
  {
    tsconfig: 'tsconfig.lib.json',
    input: 'src/mcp-server/http.ts',
    output: {
      file: '../../dist/packages/inventory/bundle/mcp/inventory-mcp-server/index.js',
      format: 'cjs',
      inlineDynamicImports: true,
    },
    platform: 'node',
    plugins: [disableTreeShake([/@aws-sdk\/.*/])],
  },
]);
