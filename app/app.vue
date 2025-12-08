<script setup lang="ts">
const colorMode = useColorMode()
const color = computed(() => (colorMode.value === 'dark' ? '#020618' : 'white'))

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' }
  ],
  htmlAttrs: { lang: 'en' }
})

useSeoMeta({
  titleTemplate: '%s - ColorShift',
  ogTitle: 'ColorShift - Convert Colors Between CSS Formats',
  ogDescription:
    'Convert colors between CSS formats instantly. Batch process CSS/SASS/PostCSS files client-side.',
  ogImage: '/og.png',
  ogUrl: 'https://colorshift.dev',
  twitterTitle: 'ColorShift - Convert Colors Between CSS Formats',
  twitterDescription:
    'Convert colors between CSS formats instantly. Batch process CSS/SASS/PostCSS files client-side.',
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
