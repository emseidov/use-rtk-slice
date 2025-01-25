import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/test/jest/index.ts', 'src/test/vitest/index.ts'],
  format: ['cjs', 'esm'],
  splitting: true,
  clean: true,
  dts: true,
  external: ['@reduxjs/toolkit', 'jest', 'react-redux', 'react', 'vitest']
})
