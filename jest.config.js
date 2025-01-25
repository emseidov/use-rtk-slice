export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}]
  },
  coveragePathIgnorePatterns: ['node_modules/', 'src/useSlice.ts', 'src/utils/']
}
