import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'], // <- restricts to src/
    exclude: ['src/test/jest/**'], // 👈 this now works!
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/**',
        'playground/**',
        'src/test/jest/**',
        '**/index.ts'
      ]
    }
  }
})
