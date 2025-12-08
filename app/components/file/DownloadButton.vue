<script setup lang="ts">
const props = defineProps<{
  content: string
  filename: string
  disabled?: boolean
}>()

const { downloadFile } = useFileProcessor()

function handleDownload() {
  if (!props.content || !props.filename) return

  // Generate new filename with format suffix
  const parts = props.filename.split('.')
  const ext = parts.pop()
  const baseName = parts.join('.')
  const newFilename = `${baseName}-converted.${ext}`

  downloadFile(props.content, newFilename)
}
</script>

<template>
  <UButton
    icon="i-lucide-download"
    size="lg"
    :disabled="disabled || !content"
    @click="handleDownload"
  >
    Download Converted File
  </UButton>
</template>
