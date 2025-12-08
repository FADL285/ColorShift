<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const navItems = computed<NavigationMenuItem[]>(() => [
  { label: 'Converter', to: '/', active: route.path === '/' },
  { label: 'File Converter', to: '/file-converter', active: route.path === '/file-converter' },
  { label: 'About', to: '/about', active: route.path === '/about' }
])
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <UHeader title="ColorShift">
      <template #title>
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/logo.png" alt="ColorShift" class="h-6" />
          <span class="font-bold">ColorShift</span>
        </NuxtLink>
      </template>

      <UNavigationMenu :items="navItems" variant="link" />

      <template #right>
        <UColorModeButton />
      </template>

      <template #body>
        <UNavigationMenu :items="navItems" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          &copy; <NuxtTime :datetime="new Date().getFullYear()" /> ColorShift. 100% client-side.
        </p>
      </template>

      <template #right>
        <UButton
          icon="i-lucide-github"
          color="neutral"
          variant="ghost"
          to="https://github.com/fadl285/color-shift"
          target="_blank"
          aria-label="GitHub"
        />
      </template>
    </UFooter>
  </div>
</template>
