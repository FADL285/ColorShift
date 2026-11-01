import { parse } from 'culori'
import { useColorConverter } from './useColorConverter'
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

  function detectColors(content: string): ColorMatch[] {
    const matches: ColorMatch[] = []
    const lineStarts = [0]
    for (let i = 0; i < content.length; i++) if (content[i] === '\n') lineStarts.push(i + 1)
    const position = (index: number) => {
      let low = 0,
        high = lineStarts.length
      while (low + 1 < high) {
        const mid = (low + high) >>> 1
        if (lineStarts[mid]! <= index) low = mid
        else high = mid
      }
      return { line: low + 1, column: index - lineStarts[low]! + 1 }
    }
    // Parse declarations, never selectors, comments, strings or URL contents.
    const stylesheet = parseStylesheet(content)
    stylesheet.walkDecls((declaration) => {
      const value = declaration.raws.value?.raw ?? declaration.value
      // Mask only interpolation spans, keeping offsets and other literal colors intact.
      let depth = 0
      let quote = ''
      const masked = value.split('')
      for (let i = 0; i < value.length; i++) {
        const char = value[i]!
        if (!depth) {
          if (char === '"' || char === "'") {
            const delimiter = char
            while (++i < value.length) {
              if (value[i] === '\\') i++
              else if (value[i] === delimiter) break
            }
          } else if (char === '/' && value[i + 1] === '*') {
            const end = value.indexOf('*/', i + 2)
            i = end < 0 ? value.length : end + 1
          } else if (char === '#' && value[i + 1] === '{') {
            depth = 1
            masked[i] = masked[i + 1] = ' '
            i++
          }
          continue
        }
        masked[i] = char === '\n' ? '\n' : ' '
        if (char === '\\') {
          if (i + 1 < value.length) masked[++i] = ' '
          continue
        }
        if (quote) {
          if (char === quote) quote = ''
          continue
        }
        if (char === '"' || char === "'") {
          quote = char
          continue
        }
        if (char === '{') depth++
        else if (char === '}') depth--
      }
      const start = declaration.source?.start?.offset
      if (start === undefined) return
      const valueStart = start + declaration.prop.length + (declaration.raws.between ?? ':').length
      valueParser(masked.join('')).walk((node) => {
        if (node.type !== 'word' && node.type !== 'function') return false
        if (node.type === 'function' && /^url$/i.test(node.value)) return false
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
          ...position(index)
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

    const chunks: string[] = []
    let cursor = 0
    let convertedCount = 0
    let failedCount = 0

    for (const match of matches) {
      const color = parse(match.original)

      if (color) {
        const convertedValue = convertToFormat(color, targetFormat, conversionOptions)

        if (convertedValue && convertedValue !== match.original) {
          chunks.push(content.slice(cursor, match.index), convertedValue)
          cursor = match.index + match.length

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
      converted: chunks.join('') + content.slice(cursor),
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
