import { useFileProcessor } from '../composables/useFileProcessor'
import type { ProcessingOptions } from '../composables/useFileProcessor'

const scope = globalThis as unknown as {
  onmessage: (event: MessageEvent<{ content: string; options: ProcessingOptions }>) => void
  postMessage: (message: unknown) => void
}
const { processFile } = useFileProcessor()
scope.onmessage = ({ data }) => {
  try {
    scope.postMessage({ result: processFile(data.content, data.options) })
  } catch {
    scope.postMessage({
      error: 'Use valid CSS or brace-based SCSS. Indented Sass is not supported.'
    })
  }
}
