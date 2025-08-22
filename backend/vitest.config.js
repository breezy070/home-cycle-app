import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./test/setup.js'],
    testTimeout: 30000, // mongodb-memory-server first-run download
  },
})
