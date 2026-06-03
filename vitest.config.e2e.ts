import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    setupFiles: ['./tests/setup-e2e.ts'],
    hookTimeout: 60000,
  },
  plugins: [swc.vite()],
  resolve: {
    tsconfigPaths: true,
  },
  oxc: false,
})
