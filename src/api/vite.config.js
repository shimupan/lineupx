import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        setupFiles: ['./test-setup.js'],
        teardownTimeout: 5000
    }
})
