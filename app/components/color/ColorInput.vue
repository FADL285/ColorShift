<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  detectedFormat: string | null
  isValid: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Track if input has been touched (blurred at least once or had a valid value)
const hasBeenTouched = ref(false)
const hasHadValidValue = ref(false)

// Track if user is currently typing
const isTyping = ref(false)
let typingTimeout: ReturnType<typeof setTimeout> | null = null

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    isTyping.value = true
    if (typingTimeout) clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => {
      isTyping.value = false
    }, 400)
    emit('update:modelValue', value)
  }
})

// Mark as touched when blurred
function onBlur() {
  hasBeenTouched.value = true
}

// Track when we've had a valid value
watch(
  () => props.isValid,
  (valid) => {
    if (valid && props.modelValue) {
      hasHadValidValue.value = true
    }
  }
)

// Only show error if: touched OR had valid value before, AND not currently typing, AND has value, AND is invalid
const showError = computed(() => {
  if (!props.modelValue) return false
  if (props.isValid) return false
  if (isTyping.value) return false
  return hasBeenTouched.value || hasHadValidValue.value
})

// Handle color picker change
function onColorPickerChange(event: Event) {
  const target = event.target as HTMLInputElement
  hasHadValidValue.value = true // Color picker always gives valid values
  emit('update:modelValue', target.value)
}

// Get the current color for the picker (fallback to gray if invalid)
const pickerColor = computed(() => {
  if (props.isValid && props.modelValue) {
    return props.modelValue.startsWith('#') ? props.modelValue : '#ffffff'
  }
  return '#ffffff'
})

// Input color state for styling
const inputColor = computed(() => {
  if (!props.modelValue) return 'neutral'
  if (props.isValid) return 'primary'
  if (showError.value) return 'error'
  return 'neutral'
})
</script>

<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-highlighted"> Enter a color </label>
    <div class="flex items-center gap-3">
      <UInput
        v-model="inputValue"
        placeholder="#ff5733, rgb(255, 87, 51), hsl(11, 100%, 60%)..."
        size="xl"
        :color="inputColor"
        class="font-mono flex-1"
        @blur="onBlur"
      />
      <div class="relative">
        <input
          type="color"
          :value="pickerColor"
          class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          @input="onColorPickerChange"
        />
        <div
          class="w-12 h-12 rounded-xl ring-1 ring-default cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:scale-105 shadow-sm"
          :style="{ backgroundColor: isValid && modelValue ? pickerColor : '#6b7280' }"
        >
          <UIcon
            name="i-lucide-pipette"
            class="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-md"
          />
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between text-xs">
      <span v-if="modelValue && isValid" class="text-muted">
        Detected format:
        <span class="font-medium text-primary">{{ detectedFormat?.toUpperCase() }}</span>
      </span>
      <span v-else-if="showError" class="text-error"> Invalid color format </span>
      <span v-else class="text-muted"> Supports HEX, RGB, HSL, HWB, LAB, LCH, OKLAB, OKLCH </span>
    </div>
  </div>
</template>
