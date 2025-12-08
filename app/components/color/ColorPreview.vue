<script setup lang="ts">
defineProps<{
  color: string
  isValid: boolean
}>()
</script>

<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-default">Preview</label>
    <div
      class="h-32 rounded-lg border border-default transition-all duration-200"
      :class="[isValid ? 'shadow-lg' : 'bg-muted', !isValid && 'flex items-center justify-center']"
      :style="isValid ? { backgroundColor: color } : {}"
    >
      <span v-if="!isValid" class="text-muted text-sm"> Enter a valid color to preview </span>
    </div>
  </div>
</template>
