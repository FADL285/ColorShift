<script setup lang="ts">
defineProps<{
  modelValue: File | null
}>()

const emit = defineEmits<{
  'update:modelValue': [file: File | null]
  'content-loaded': [content: string, filename: string]
}>()

const toast = useToast()
const isDragging = ref(false)

const acceptedTypes = ['.css', '.scss', '.sass', '.postcss']
const maxFileSize = 5 * 1024 * 1024 // 5MB

async function handleFile(file: File) {
  // Validate file size
  if (file.size > maxFileSize) {
    toast.add({
      title: 'File too large',
      description: 'Maximum file size is 5MB',
      color: 'error'
    })
    return
  }

  // Validate file type
  const extension = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!acceptedTypes.includes(extension)) {
    toast.add({
      title: 'Invalid file type',
      description: `Accepted types: ${acceptedTypes.join(', ')}`,
      color: 'error'
    })
    return
  }

  emit('update:modelValue', file)

  try {
    const content = await file.text()
    emit('content-loaded', content, file.name)
  } catch {
    toast.add({
      title: 'Failed to read file',
      description: 'Could not read the file content',
      color: 'error'
    })
  }
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) handleFile(file)
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) handleFile(file)
}

function clearFile() {
  emit('update:modelValue', null)
  emit('content-loaded', '', '')
}
</script>

<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-default">Upload CSS File</label>

    <div
      v-if="!modelValue"
      class="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer"
      :class="[
        isDragging ? 'border-(--ui-primary) bg-primary/5' : 'border-default hover:border-primary'
      ]"
      @drop.prevent="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @click="($refs.fileInput as HTMLInputElement).click()"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="acceptedTypes.join(',')"
        class="hidden"
        @change="onFileSelect"
      />
      <UIcon name="i-lucide-upload" class="w-10 h-10 mx-auto text-muted mb-3" />
      <p class="text-default font-medium">Drop your file here or click to browse</p>
      <p class="text-muted text-sm mt-1">Supports {{ acceptedTypes.join(', ') }} files up to 5MB</p>
    </div>

    <div
      v-else
      class="flex items-center justify-between p-4 rounded-lg border border-default bg-default"
    >
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-file-text" class="w-8 h-8 text-primary" />
        <div>
          <p class="font-medium text-default">{{ modelValue.name }}</p>
          <p class="text-sm text-muted">{{ (modelValue.size / 1024).toFixed(1) }} KB</p>
        </div>
      </div>
      <UButton
        icon="i-lucide-x"
        variant="ghost"
        size="sm"
        color="error"
        aria-label="Remove file"
        @click="clearFile"
      />
    </div>
  </div>
</template>
