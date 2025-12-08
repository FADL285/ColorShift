<script setup lang="ts">
import type { ColorFormat } from '~/composables/useColorFormats'

const props = defineProps<{
  format: ColorFormat
  label: string
  value: string
  isValid: boolean
}>()

const toast = useToast()
const copied = ref(false)

async function copyToClipboard() {
  if (!props.value || !props.isValid) return

  try {
    await navigator.clipboard.writeText(props.value)
    copied.value = true
    toast.add({
      title: 'Copied!',
      description: `${props.label} value copied to clipboard`,
      color: 'success',
      duration: 2000
    })
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    toast.add({
      title: 'Failed to copy',
      description: 'Could not copy to clipboard',
      color: 'error',
      duration: 2000
    })
  }
}
</script>

<template>
  <div
    class="group flex items-center justify-between p-3 rounded-lg border border-default bg-default hover:border-primary transition-colors"
    :class="{ 'opacity-50': !isValid }"
  >
    <div class="flex-1 min-w-0">
      <span class="text-xs font-medium text-muted uppercase tracking-wide">
        {{ label }}
      </span>
      <p class="font-mono text-sm text-default truncate mt-0.5" :title="value">
        {{ value || '—' }}
      </p>
    </div>
    <UButton
      :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
      variant="ghost"
      size="xs"
      :disabled="!isValid || !value"
      :color="copied ? 'success' : 'neutral'"
      class="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
      aria-label="Copy to clipboard"
      @click="copyToClipboard"
    />
  </div>
</template>
