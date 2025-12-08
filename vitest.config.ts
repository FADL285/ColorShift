import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    // Run all unit tests in Nuxt environment since composables use auto-imports
    include: ['test/unit/**/*.{test,spec}.ts'],
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom'
      }
    },
    coverage: {
      provider: 'v8',
      include: ['app/composables/**/*.ts'],
      exclude: ['**/*.d.ts', '**/types.ts']
    }
  }
})
