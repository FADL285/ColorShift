<script setup lang="ts">
const appConfig = useAppConfig()

useSeoMeta({
  title: `${appConfig.name} - About`,
  description: `Learn about ${appConfig.name}, the privacy-focused color conversion tool. 100% client-side processing for CSS color format conversion.`
})

const { formats } = useColorFormats()

const features = [
  {
    icon: 'i-lucide-zap',
    title: 'Instant Conversion',
    description: 'Convert colors in real-time as you type with live preview',
    highlight: true,
    highlightColor: 'primary' as const
  },
  {
    icon: 'i-lucide-file-code',
    title: 'Batch Processing',
    description: 'Upload CSS/SASS files and convert all colors at once',
    highlight: true,
    highlightColor: 'info' as const
  },
  {
    icon: 'i-lucide-shield-check',
    title: '100% Client-Side',
    description: 'All processing happens in your browser. No data sent to servers',
    highlight: true,
    highlightColor: 'success' as const
  },
  {
    icon: 'i-lucide-palette',
    title: 'All CSS Formats',
    description: 'Supports HEX, RGB, HSL, HWB, LAB, LCH, OKLAB, OKLCH',
    highlight: true,
    highlightColor: 'warning' as const
  }
]

const steps = [
  {
    icon: 'i-lucide-upload',
    title: '1. Enter or Upload',
    description: 'Type a color value or upload your CSS/SASS file'
  },
  {
    icon: 'i-lucide-scan-search',
    title: '2. Automatic Detection',
    description: 'ColorShift detects color formats using the culori library'
  },
  {
    icon: 'i-lucide-copy-check',
    title: '3. Convert & Copy',
    description: 'Get instant conversions to all formats or download your converted file'
  }
]

const privacyPoints = [
  {
    title: 'No Server Processing',
    description: 'All color conversions happen entirely in your browser using JavaScript'
  },
  {
    title: 'No Data Collection',
    description: "We don't collect, store, or transmit any of your color values or files"
  },
  {
    title: 'No Cookies',
    description: "ColorShift doesn't use tracking cookies or analytics"
  },
  {
    title: 'Open Source',
    description: 'The source code is available on GitHub for full transparency'
  }
]
</script>

<template>
  <div>
    <!-- Header Section -->
    <UPageSection
      title="About ColorShift"
      description="A free, privacy-focused tool for designers and developers to convert colors between CSS formats."
    >
      <!-- Features Grid -->
      <UPageGrid class="lg:grid-cols-2">
        <UPageCard
          v-for="feature in features"
          :key="feature.title"
          :title="feature.title"
          :description="feature.description"
          :icon="feature.icon"
          spotlight
        />
      </UPageGrid>
    </UPageSection>

    <!-- Supported Formats Section -->
    <UPageSection title="Supported Color Formats" :ui="{ root: 'bg-muted/30' }">
      <UCard>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-default">
                <th class="text-left py-3 px-4 font-semibold text-highlighted">Format</th>
                <th class="text-left py-3 px-4 font-semibold text-highlighted">Example</th>
                <th class="text-left py-3 px-4 font-semibold text-highlighted hidden sm:table-cell">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="format in formats"
                :key="format.id"
                class="border-b border-default last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td class="py-3 px-4 font-medium text-highlighted">{{ format.label }}</td>
                <td class="py-3 px-4 font-mono text-muted text-sm">{{ format.example }}</td>
                <td class="py-3 px-4 text-muted hidden sm:table-cell">{{ format.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <template #footer>
          <p class="text-sm text-muted">
            All formats support alpha channel transparency (e.g., rgba, hsla, oklch with /alpha).
          </p>
        </template>
      </UCard>
    </UPageSection>

    <!-- How It Works Section -->
    <UPageSection
      title="How It Works"
      :ui="{ root: 'bg-linear-to-b from-primary/5 to-transparent' }"
    >
      <UPageGrid class="lg:grid-cols-3">
        <UPageCard
          v-for="item in steps"
          :key="item.title"
          :title="item.title"
          :description="item.description"
          :icon="item.icon"
          spotlight
        />
      </UPageGrid>
    </UPageSection>

    <!-- Privacy Statement Section -->
    <UPageSection title="Privacy Statement">
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <UIcon name="i-lucide-lock" class="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 class="font-semibold text-highlighted">Your Privacy Matters</h3>
              <p class="text-sm text-muted">ColorShift is built with privacy as a core principle</p>
            </div>
          </div>
        </template>

        <div class="grid gap-4 sm:grid-cols-2">
          <div
            v-for="point in privacyPoints"
            :key="point.title"
            class="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
          >
            <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 class="font-medium text-highlighted text-sm">{{ point.title }}</h4>
              <p class="text-sm text-muted">{{ point.description }}</p>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <p class="text-sm text-muted">
              Your files never leave your computer. Everything is processed in your browser's
              memory.
            </p>
            <UButton
              :to="appConfig.repository"
              target="_blank"
              variant="outline"
              icon="i-lucide-github"
            >
              View Source
            </UButton>
          </div>
        </template>
      </UCard>
    </UPageSection>
  </div>
</template>
