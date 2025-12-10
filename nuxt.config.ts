// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/seo',
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@vueuse/nuxt',
    'magic-regexp/nuxt'
  ],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  components: [{ path: '~/components', pathPrefix: false }],

  compatibilityDate: '2025-07-15',

  // SEO Configuration
  site: {
    url: 'https://colorshift.fadl.info',
    name: 'ColorShift',
    description:
      'Free online color converter tool. Convert colors between HEX, RGB, HSL, OKLCH, LAB, LCH, and more CSS formats. Batch process CSS files. 100% client-side and privacy-focused.',
    defaultLocale: 'en'
  },

  // Sitemap configuration
  sitemap: {
    strictNuxtContentPaths: true
  },

  // Schema.org configuration
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'ColorShift',
      url: 'https://colorshift.fadl.info',
      logo: 'https://colorshift.fadl.info/og.png'
    }
  },

  // Robots configuration
  robots: {
    sitemap: '/sitemap.xml'
  }
})
