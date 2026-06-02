import { resolve } from 'node:path'
import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    setupFiles: ['./tests/setup-e2e.ts'],
  },
  plugins: [swc.vite()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      src: resolve(__dirname, './src'),
    },
  },
  oxc: false,
})
