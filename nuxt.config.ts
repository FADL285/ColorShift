// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/hints', '@nuxt/ui', '@nuxt/test-utils', '@vueuse/nuxt'],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  components: [{ path: '~/components', pathPrefix: false }],

  compatibilityDate: '2025-07-15'
})
