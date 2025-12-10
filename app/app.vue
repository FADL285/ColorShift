<script setup lang="ts">
const appConfig = useAppConfig()
const colorMode = useColorMode()
const color = computed(() => (colorMode.value === 'dark' ? '#020618' : 'white'))

const route = useRoute()
const canonicalUrl = computed(() => `${appConfig.url}${route.path}`)

useHead(() => ({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color.value },
    {
      name: 'google-site-verification',
      content: 'rZxcyggOHyW5Z-EKpugLEbjuPwK9tOuBdgVwzKOitzQ'
    }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'canonical', href: canonicalUrl.value }
  ],
  htmlAttrs: { lang: 'en' }
}))

const ogTitle = `${appConfig.name} - Convert Colors Between CSS Formats`
const ogDescription = `${appConfig.description}. Batch process CSS/SASS/PostCSS files client-side.`

useSeoMeta({
  titleTemplate: `%s - ${appConfig.name}`,
  ogTitle,
  ogDescription,
  ogImage: '/og.png',
  ogUrl: appConfig.url,
  twitterTitle: ogTitle,
  twitterDescription: ogDescription,
  twitterImage: '/og.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
