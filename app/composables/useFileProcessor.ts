import { parse } from 'culori'
import { parse as parseStylesheet } from 'postcss-scss'
import valueParser from 'postcss-value-parser'
import type { ColorFormat } from './useColorFormats'
import type { ConversionOptions } from './useColorConverter'
import { COMBINED_COLOR_REGEX } from '~/utils/colorPatterns'

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
    // Parse declarations, never selectors, comments, strings or URL contents.
    // SCSS interpolation is deliberately left untouched instead of guessing its value.
    const stylesheet = parseStylesheet(content)
    stylesheet.walkDecls((declaration) => {
      const value = declaration.raws.value?.raw ?? declaration.value
      if (value.includes('#{')) return
      const start = declaration.source?.start?.offset
      if (start === undefined) return
      const valueStart = start + declaration.prop.length + declaration.raws.between!.length
      valueParser(value).walk((node) => {
        if (node.type !== 'word' && node.type !== 'function') return false
        if (node.type === 'function' && /^(url|var|env)$/i.test(node.value)) return false
        const candidate = value.slice(node.sourceIndex, node.sourceEndIndex)
        COMBINED_COLOR_REGEX.lastIndex = 0
        const match = COMBINED_COLOR_REGEX.exec(candidate)
        if (match?.[0] !== candidate) return
        const index = valueStart + node.sourceIndex
        matches.push({
          original: candidate,
          converted: '',
          index,
          length: candidate.length,
          ...getLineAndColumn(content, index)
        })
        return false
      })
    })

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
