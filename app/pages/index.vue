<script setup lang="ts">
import type { ColorFormat } from '~/composables/useColorFormats'

useSeoMeta({
  title: 'ColorShift - Convert Colors Between CSS Formats',
  description:
    'ColorShift: Convert colors between CSS formats instantly. Supports HEX, RGB, HSL, HWB, LAB, LCH, OKLAB, OKLCH and more.'
})

const { parseColor, getAllFormats } = useColorConverter()

const colorInput = ref('')
const debouncedInput = refDebounced(colorInput, 200)

const parsedColor = computed(() => parseColor(debouncedInput.value))

const isValid = computed(() => parsedColor.value.isValid)
const detectedFormat = computed(() => parsedColor.value.format)

const allFormats = computed(() => {
  if (!isValid.value || !parsedColor.value.color) {
    return {
      hex: '',
      rgb: '',
      hsl: '',
      hwb: '',
      lab: '',
      lch: '',
      oklab: '',
      oklch: ''
    } as Record<ColorFormat, string>
  }
  return getAllFormats(parsedColor.value.color)
})

// Get a valid CSS color for preview
const previewColor = computed(() => {
  if (!isValid.value) return ''
  return allFormats.value.rgb || allFormats.value.hex
})

// Demo colors for quick testing
const demoColors = [
  { color: '#ff5733', name: 'Coral' },
  { color: '#3498db', name: 'Blue' },
  { color: '#2ecc71', name: 'Green' },
  { color: '#9b59b6', name: 'Purple' },
  { color: '#f39c12', name: 'Orange' },
  { color: '#1abc9c', name: 'Teal' }
]

function selectDemoColor(color: string) {
  colorInput.value = color
}

// Hero CTA buttons
const heroLinks = [
  {
    label: 'Try Converter',
    icon: 'i-lucide-palette',
    to: '#converter',
    size: 'xl' as const
  },
  {
    label: 'View on GitHub',
    icon: 'i-lucide-github',
    to: 'https://github.com/fadl285/color-shift',
    target: '_blank',
    variant: 'outline' as const,
    size: 'xl' as const
  }
]

// Features for the highlight section
const features = [
  {
    icon: 'i-lucide-zap',
    title: 'Instant Conversion',
    description: 'Convert colors in real-time as you type with live preview'
  },
  {
    icon: 'i-lucide-shield-check',
    title: 'Privacy First',
    description: 'All processing happens in your browser. No data sent to servers'
  },
  {
    icon: 'i-lucide-palette',
    title: 'All CSS Formats',
    description: 'HEX, RGB, HSL, HWB, LAB, LCH, OKLAB, OKLCH with alpha support'
  },
  {
    icon: 'i-lucide-github',
    title: 'Free & Open Source',
    description: 'MIT licensed and available on GitHub for full transparency'
  }
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <UPageHero
      title="Convert Colors Instantly"
      description="Transform colors between HEX, RGB, HSL, OKLCH, and more CSS formats. 100% client-side, fast, and free."
      :links="heroLinks"
      headline="Free & Open Source"
      :ui="{
        container: 'md:pt-18 lg:pt-20 md:pb-18 lg:pb-20'
      }"
    />

    <!-- Features Section -->
    <UPageSection>
      <UPageGrid class="lg:grid-cols-4">
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

    <!-- Converter Section -->
    <UPageSection
      id="converter"
      title="Color Converter"
      description="Enter any color value and see it converted to all CSS formats instantly."
      :ui="{ root: 'bg-muted/30' }"
    >
      <UCard>
        <div class="space-y-6">
          <!-- Row 1: Color Input with Picker -->
          <ColorInput v-model="colorInput" :detected-format="detectedFormat" :is-valid="isValid" />

          <!-- Row 2: Quick Palette -->
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-muted/50"
          >
            <div class="flex items-center gap-2 shrink-0">
              <UIcon name="i-lucide-sparkles" class="w-4 h-4 text-primary" />
              <span class="text-sm font-medium text-highlighted">Quick Palette</span>
            </div>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="demo in demoColors"
                :key="demo.color"
                :style="{ backgroundColor: demo.color }"
                class="group relative w-10 h-10 rounded-lg cursor-pointer ring-1 ring-default hover:ring-2 hover:ring-primary transition-all hover:scale-110 shadow-sm hover:shadow-lg"
                :title="demo.name"
                @click="selectDemoColor(demo.color)"
              >
                <UTooltip :text="demo.name">
                  <span class="sr-only">{{ demo.name }}</span>
                </UTooltip>
              </button>
            </div>
          </div>

          <!-- Row 3: Color Preview -->
          <ColorPreview :color="previewColor" :is-valid="isValid" />

          <!-- Row 4: All Formats Output -->
          <ColorOutput :formats="allFormats" :is-valid="isValid" />
        </div>
      </UCard>
    </UPageSection>

    <!-- Supported Formats Section -->
    <UPageSection title="Supported Formats">
      <UCard>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div
            v-for="format in [
              '#ff5733',
              'rgb(255, 87, 51)',
              'hsl(11, 100%, 60%)',
              'oklch(0.68 0.17 40)'
            ]"
            :key="format"
            class="font-mono text-muted bg-muted px-3 py-2 rounded-lg"
          >
            {{ format }}
          </div>
        </div>
        <template #footer>
          <p class="text-sm text-muted">
            Also supports HWB, LAB, LCH, OKLAB formats with alpha channels.
            <NuxtLink to="/about" class="text-primary hover:underline">Learn more</NuxtLink>
          </p>
        </template>
      </UCard>
    </UPageSection>

    <USeparator />

    <!-- CTA Section -->
    <UPageCTA
      title="Need to Convert Entire Files?"
      description="Upload your CSS, SASS, or PostCSS files and convert all color values at once. Perfect for migrating to modern color formats like OKLCH."
      :links="[
        {
          label: 'Try File Converter',
          icon: 'i-lucide-file-code',
          to: '/file-converter',
          size: 'lg'
        },
        {
          label: 'Learn More',
          to: '/about',
          variant: 'outline',
          trailingIcon: 'i-lucide-arrow-right',
          size: 'lg'
        }
      ]"
      variant="naked"
      class="overflow-hidden"
    >
      <LazyStarsBg />
    </UPageCTA>
  </div>
</template>
