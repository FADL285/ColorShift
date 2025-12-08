import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom'
      }
    },
    include: ['test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['app/composables/**/*.ts'],
      exclude: ['**/*.d.ts', '**/types.ts']
    }
  }
})
