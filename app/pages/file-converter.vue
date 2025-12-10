<script setup lang="ts">
import type { ColorFormat } from '~/composables/useColorFormats'
import type { ProcessingResult } from '~/composables/useFileProcessor'

// SEO Meta Tags with keyword optimization
useSeoMeta({
  title: 'Batch CSS Color Converter - Convert Entire Files to OKLCH',
  description:
    'Batch convert all colors in CSS, SASS, and PostCSS files. Transform HEX to OKLCH, RGB to HSL, and more. 100% client-side processing, your files stay private.',
  keywords:
    'batch color converter, css color converter, sass color converter, postcss color converter, bulk color conversion, hex to oklch converter, css file converter, convert css colors, batch hex to rgb, css color migration',
  ogTitle: 'ColorShift File Converter - Batch CSS Color Conversion',
  ogDescription:
    'Upload CSS files and convert all colors at once. Perfect for migrating to modern OKLCH format. 100% private, client-side processing.'
})

// Structured Data for file converter page
useSchemaOrg([
  defineWebPage({
    '@type': 'WebPage',
    name: 'Batch CSS Color Converter - ColorShift',
    description:
      'Batch convert all colors in CSS, SASS, and PostCSS files to your preferred format.'
  })
])

const { processFile } = useFileProcessor()

// State
const file = ref<File | null>(null)
const fileContent = ref('')
const filename = ref('')

// Settings
const targetFormat = ref<ColorFormat>('oklch')
const precision = ref(3)
const alphaFormat = ref<'decimal' | 'percentage' | 'preserve'>('decimal')

// Result
const processingResult = ref<ProcessingResult | null>(null)
const isProcessing = ref(false)
const previewTab = ref('side-by-side')

// Handle file content loaded
function onContentLoaded(content: string, name: string) {
  fileContent.value = content
  filename.value = name
  processingResult.value = null

  if (content) {
    processContent()
  }
}

// Process the file content
function processContent() {
  if (!fileContent.value) return

  isProcessing.value = true

  // Use requestAnimationFrame to keep UI responsive
  requestAnimationFrame(() => {
    processingResult.value = processFile(fileContent.value, {
      targetFormat: targetFormat.value,
      precision: precision.value,
      alphaFormat: alphaFormat.value
    })
    isProcessing.value = false
  })
}

// Watch for settings changes
watch([targetFormat, precision, alphaFormat], () => {
  if (fileContent.value) {
    processContent()
  }
})
</script>

<template>
  <div>
    <UPageSection
      title="Batch Convert CSS Files"
      description="Upload your CSS, SASS, or PostCSS files and convert all color values to your preferred format. 100% client-side processing."
    >
      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Left Column: Upload & Settings -->
        <div>
          <div class="space-y-6 sticky top-24">
            <UCard>
              <FileUploader v-model="file" @content-loaded="onContentLoaded" />
            </UCard>

            <ConversionSettings
              v-model:target-format="targetFormat"
              v-model:precision="precision"
              v-model:alpha-format="alphaFormat"
            />

            <DownloadButton
              v-if="processingResult"
              :content="processingResult.converted"
              :filename="filename"
              :disabled="!processingResult || processingResult.stats.converted === 0"
              class="w-full"
            />
          </div>
        </div>

        <!-- Right Column: Preview -->
        <div class="lg:col-span-2">
          <UCard v-if="!file" class="h-full">
            <div class="flex items-center justify-center py-16">
              <div class="text-center">
                <UIcon name="i-lucide-file-code" class="w-16 h-16 mx-auto text-muted mb-4" />
                <h3 class="text-lg font-medium text-highlighted mb-2">No file uploaded</h3>
                <p class="text-muted">Upload a CSS file to preview color conversions</p>
              </div>
            </div>
          </UCard>

          <UCard v-else-if="isProcessing" class="h-full">
            <div class="flex items-center justify-center py-16">
              <div class="text-center">
                <UIcon
                  name="i-lucide-loader-2"
                  class="w-12 h-12 mx-auto text-primary animate-spin mb-4"
                />
                <p class="text-muted">Processing file...</p>
              </div>
            </div>
          </UCard>

          <FileDiffPreview
            v-else-if="processingResult"
            v-model:active-tab="previewTab"
            :original="processingResult.original"
            :converted="processingResult.converted"
            :changes="processingResult.changes"
            :stats="processingResult.stats"
          />
        </div>
      </div>
    </UPageSection>

    <USeparator />

    <UPageCTA
      title="100% Private & Secure"
      description="Your files never leave your browser. All processing happens locally using JavaScript - no uploads, no servers, no data collection. Your code stays confidential."
      :links="[
        {
          label: 'Learn How It Works',
          icon: 'i-lucide-info',
          to: '/about',
          size: 'lg'
        },
        {
          label: 'Try Single Color',
          to: '/#converter',
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
