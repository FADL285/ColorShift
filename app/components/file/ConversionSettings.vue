<script setup lang="ts">
import type { ColorFormat } from '~/composables/useColorFormats'

defineProps<{
  targetFormat: ColorFormat
  precision: number
  alphaFormat: 'decimal' | 'percentage' | 'preserve'
}>()

const emit = defineEmits<{
  'update:targetFormat': [format: ColorFormat]
  'update:precision': [precision: number]
  'update:alphaFormat': [format: 'decimal' | 'percentage' | 'preserve']
}>()

const { formats } = useColorFormats()

const formatOptions = formats.map((f) => ({
  label: f.label,
  value: f.id
}))

const alphaOptions = [
  { label: 'Decimal (0.5)', value: 'decimal' as const },
  { label: 'Percentage (50%)', value: 'percentage' as const },
  { label: 'Preserve Original', value: 'preserve' as const }
]
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="font-semibold text-default">Conversion Settings</h3>
    </template>

    <div class="space-y-6">
      <!-- Target Format -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-default">Target Format</label>
        <USelect
          :model-value="targetFormat"
          :items="formatOptions"
          value-key="value"
          class="w-full"
          @update:model-value="(v: ColorFormat) => emit('update:targetFormat', v)"
        />
      </div>

      <!-- Precision -->
      <div class="space-y-2">
        <div class="flex justify-between">
          <label class="block text-sm font-medium text-default">Decimal Precision</label>
          <span class="text-sm text-muted">{{ precision }}</span>
        </div>
        <USlider
          :model-value="precision"
          :min="1"
          :max="5"
          :step="1"
          @update:model-value="(v) => v !== undefined && emit('update:precision', v)"
        />
        <p class="text-xs text-muted">Controls decimal places for LAB, LCH, OKLAB, OKLCH formats</p>
      </div>

      <!-- Alpha Format -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-default">Alpha Channel Format</label>
        <URadioGroup
          :model-value="alphaFormat"
          :items="alphaOptions"
          value-key="value"
          @update:model-value="
            (v: 'decimal' | 'percentage' | 'preserve') => emit('update:alphaFormat', v)
          "
        />
      </div>
    </div>
  </UCard>
</template>
