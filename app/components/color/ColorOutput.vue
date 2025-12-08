<script setup lang="ts">
import type { ColorFormat } from '~/composables/useColorFormats'

defineProps<{
  formats: Record<ColorFormat, string>
  isValid: boolean
}>()

const { formats: formatDefinitions } = useColorFormats()
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <label class="block text-sm font-medium text-default">All Formats</label>
      <span v-if="isValid" class="text-xs text-muted">Click to copy</span>
    </div>
    <div class="grid gap-2 sm:grid-cols-2">
      <FormatCard
        v-for="format in formatDefinitions"
        :key="format.id"
        :format="format.id"
        :label="format.label"
        :value="formats[format.id]"
        :is-valid="isValid"
      />
    </div>
  </div>
</template>
