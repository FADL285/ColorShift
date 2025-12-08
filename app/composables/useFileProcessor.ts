import { parse } from 'culori'
import type { ColorFormat } from './useColorFormats'
import type { ConversionOptions } from './useColorConverter'

export interface ColorMatch {
  original: string
  converted: string
  index: number
  length: number
  line: number
  column: number
}

export interface ProcessingResult {
  original: string
  converted: string
  changes: ColorMatch[]
  stats: {
    total: number
    converted: number
    failed: number
  }
}

export interface ProcessingOptions extends ConversionOptions {
  targetFormat: ColorFormat
}

// Combined regex to match all CSS color formats
const COMBINED_COLOR_REGEX =
  /#(?:[a-fA-F0-9]{3,4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})\b|rgba?\(\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?\s*(?:[,/]\s*[\d.]+%?)?\s*\)|hsla?\(\s*[\d.]+(?:deg|rad|grad|turn)?\s*[,\s]\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?\s*(?:[,/]\s*[\d.]+%?)?\s*\)|hwb\(\s*[\d.]+(?:deg|rad|grad|turn)?\s+[\d.]+%\s+[\d.]+%\s*(?:\/\s*[\d.]+%?)?\s*\)|lab\(\s*[\d.]+%?\s+[\d.-]+\s+[\d.-]+\s*(?:\/\s*[\d.]+%?)?\s*\)|lch\(\s*[\d.]+%?\s+[\d.]+\s+[\d.]+(?:deg|rad|grad|turn)?\s*(?:\/\s*[\d.]+%?)?\s*\)|oklab\(\s*[\d.]+%?\s+[\d.-]+\s+[\d.-]+\s*(?:\/\s*[\d.]+%?)?\s*\)|oklch\(\s*[\d.]+%?\s+[\d.]+\s+[\d.]+(?:deg|rad|grad|turn)?\s*(?:\/\s*[\d.]+%?)?\s*\)/gi

export function useFileProcessor() {
  const { convertToFormat } = useColorConverter()

  function getLineAndColumn(content: string, index: number): { line: number; column: number } {
    const lines = content.substring(0, index).split('\n')
    return {
      line: lines.length,
      column: (lines[lines.length - 1]?.length ?? 0) + 1
    }
  }

  function detectColors(content: string): ColorMatch[] {
    const matches: ColorMatch[] = []
    let match

    // Reset regex
    COMBINED_COLOR_REGEX.lastIndex = 0

    while ((match = COMBINED_COLOR_REGEX.exec(content)) !== null) {
      const { line, column } = getLineAndColumn(content, match.index)
      matches.push({
        original: match[0],
        converted: '',
        index: match.index,
        length: match[0].length,
        line,
        column
      })
    }

    return matches
  }

  function processFile(content: string, options: ProcessingOptions): ProcessingResult {
    const { targetFormat, ...conversionOptions } = options
    const matches = detectColors(content)
    const changes: ColorMatch[] = []

    let converted = content
    let offset = 0
    let convertedCount = 0
    let failedCount = 0

    for (const match of matches) {
      const color = parse(match.original)

      if (color) {
        const convertedValue = convertToFormat(color, targetFormat, conversionOptions)

        if (convertedValue && convertedValue !== match.original) {
          // Update the converted content
          const adjustedIndex = match.index + offset
          converted =
            converted.substring(0, adjustedIndex) +
            convertedValue +
            converted.substring(adjustedIndex + match.length)

          // Update offset for future replacements
          offset += convertedValue.length - match.length

          // Track the change
          changes.push({
            ...match,
            converted: convertedValue
          })

          convertedCount++
        }
      } else {
        failedCount++
      }
    }

    return {
      original: content,
      converted,
      changes,
      stats: {
        total: matches.length,
        converted: convertedCount,
        failed: failedCount
      }
    }
  }

  function createDownloadBlob(content: string, _filename: string): { blob: Blob; url: string } {
    const blob = new Blob([content], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    return { blob, url }
  }

  function downloadFile(content: string, filename: string): void {
    const { url } = createDownloadBlob(content, filename)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return {
    detectColors,
    processFile,
    createDownloadBlob,
    downloadFile
  }
}
