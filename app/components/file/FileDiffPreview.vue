<script setup lang="ts">
import type { ColorMatch } from '~/composables/useFileProcessor'

defineProps<{
  original: string
  converted: string
  changes: ColorMatch[]
  stats: {
    total: number
    converted: number
    failed: number
  }
}>()

const activeTab = defineModel<string>('activeTab', { default: 'side-by-side' })

const tabs = [
  { label: 'Side by Side', value: 'side-by-side' },
  { label: 'Original', value: 'original' },
  { label: 'Converted', value: 'converted' },
  { label: 'Changes', value: 'changes' }
]
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-default">Preview</h3>
        <div class="flex items-center gap-4 text-sm">
          <span class="text-muted">
            <span class="font-medium text-success">{{ stats.converted }}</span> converted
          </span>
          <span v-if="stats.failed > 0" class="text-muted">
            <span class="font-medium text-error">{{ stats.failed }}</span> failed
          </span>
        </div>
      </div>
    </template>

    <!-- Tabs -->
    <UTabs v-model="activeTab" :items="tabs" class="mb-4" />

    <!-- Side by Side View -->
    <div v-if="activeTab === 'side-by-side'" class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="text-sm font-medium text-muted">Original</label>
        <pre
          class="p-4 rounded-lg bg-muted text-sm font-mono overflow-auto max-h-96 text-default"
          >{{ original }}</pre
        >
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-muted">Converted</label>
        <pre
          class="p-4 rounded-lg bg-muted text-sm font-mono overflow-auto max-h-96 text-default"
          >{{ converted }}</pre
        >
      </div>
    </div>

    <!-- Original Only -->
    <div v-else-if="activeTab === 'original'">
      <pre
        class="p-4 rounded-lg bg-muted text-sm font-mono overflow-auto max-h-[500px] text-default"
        >{{ original }}</pre
      >
    </div>

    <!-- Converted Only -->
    <div v-else-if="activeTab === 'converted'">
      <pre
        class="p-4 rounded-lg bg-muted text-sm font-mono overflow-auto max-h-[500px] text-default"
        >{{ converted }}</pre
      >
    </div>

    <!-- Changes List -->
    <div v-else-if="activeTab === 'changes'" class="space-y-2">
      <div v-if="changes.length === 0" class="text-center py-8 text-muted">
        No color changes detected
      </div>
      <div
        v-for="(change, index) in changes"
        :key="index"
        class="flex items-center gap-4 p-3 rounded-lg bg-muted"
      >
        <span class="text-xs text-muted">Line {{ change.line }}</span>
        <code class="text-sm font-mono text-error">{{ change.original }}</code>
        <UIcon name="i-lucide-arrow-right" class="w-4 h-4 text-muted" />
        <code class="text-sm font-mono text-success">{{ change.converted }}</code>
      </div>
    </div>
  </UCard>
</template>
