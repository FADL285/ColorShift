import { parse, converter, formatHex, formatCss } from 'culori'
import type { Color } from 'culori'
import type { ColorFormat } from './useColorFormats'

export interface ConversionOptions {
  precision?: number
  alphaFormat?: 'decimal' | 'percentage' | 'preserve'
}

export interface ParsedColor {
  color: Color | undefined
  format: ColorFormat | null
  isValid: boolean
  original: string
}

export interface ConversionResult {
  value: string
  format: ColorFormat
  isValid: boolean
}

const toHsl = converter('hsl')
const toHwb = converter('hwb')
const toLab = converter('lab')
const toLch = converter('lch')
const toOklab = converter('oklab')
const toOklch = converter('oklch')
const toRgb = converter('rgb')

function formatNumber(num: number | undefined, precision: number): string {
  if (num === undefined || isNaN(num)) return '0'
  return parseFloat(num.toFixed(precision)).toString()
}

function formatAlpha(
  alpha: number | undefined,
  format: 'decimal' | 'percentage' | 'preserve'
): string {
  if (alpha === undefined || alpha >= 1) return ''
  if (format === 'percentage') {
    return ` / ${formatNumber(alpha * 100, 1)}%`
  }
  return ` / ${formatNumber(alpha, 2)}`
}

export function useColorConverter() {
  const { detectFormat } = useColorFormats()

  function parseColor(input: string): ParsedColor {
    const trimmed = input.trim()
    if (!trimmed) {
      return { color: undefined, format: null, isValid: false, original: input }
    }

    const color = parse(trimmed)
    const format = detectFormat(trimmed)

    return {
      color,
      format,
      isValid: color !== undefined,
      original: input
    }
  }

  function convertToFormat(
    color: Color,
    targetFormat: ColorFormat,
    options: ConversionOptions = {}
  ): string {
    const { precision = 2, alphaFormat = 'decimal' } = options

    switch (targetFormat) {
      case 'hex': {
        const hex = formatHex(color)
        // Handle alpha in hex
        if (color.alpha !== undefined && color.alpha < 1) {
          const alphaHex = Math.round(color.alpha * 255)
            .toString(16)
            .padStart(2, '0')
          return `${hex}${alphaHex}`
        }
        return hex ?? ''
      }

      case 'rgb': {
        const rgb = toRgb(color)
        if (!rgb) return ''
        const r = Math.round((rgb.r ?? 0) * 255)
        const g = Math.round((rgb.g ?? 0) * 255)
        const b = Math.round((rgb.b ?? 0) * 255)
        const alpha = formatAlpha(rgb.alpha, alphaFormat)
        if (alpha) {
          return `rgba(${r}, ${g}, ${b}${alpha})`
        }
        return `rgb(${r}, ${g}, ${b})`
      }

      case 'hsl': {
        const hsl = toHsl(color)
        if (!hsl) return ''
        const h = formatNumber(hsl.h ?? 0, 1)
        const s = formatNumber((hsl.s ?? 0) * 100, 1)
        const l = formatNumber((hsl.l ?? 0) * 100, 1)
        const alpha = formatAlpha(hsl.alpha, alphaFormat)
        if (alpha) {
          return `hsla(${h}, ${s}%, ${l}%${alpha})`
        }
        return `hsl(${h}, ${s}%, ${l}%)`
      }

      case 'hwb': {
        const hwb = toHwb(color)
        if (!hwb) return ''
        const h = formatNumber(hwb.h ?? 0, 1)
        const w = formatNumber((hwb.w ?? 0) * 100, 1)
        const b = formatNumber((hwb.b ?? 0) * 100, 1)
        const alpha = formatAlpha(hwb.alpha, alphaFormat)
        return `hwb(${h} ${w}% ${b}%${alpha})`
      }

      case 'lab': {
        const lab = toLab(color)
        if (!lab) return ''
        const l = formatNumber(lab.l ?? 0, precision)
        const a = formatNumber(lab.a ?? 0, precision)
        const b = formatNumber(lab.b ?? 0, precision)
        const alpha = formatAlpha(lab.alpha, alphaFormat)
        return `lab(${l} ${a} ${b}${alpha})`
      }

      case 'lch': {
        const lch = toLch(color)
        if (!lch) return ''
        const l = formatNumber(lch.l ?? 0, precision)
        const c = formatNumber(lch.c ?? 0, precision)
        const h = formatNumber(lch.h ?? 0, precision)
        const alpha = formatAlpha(lch.alpha, alphaFormat)
        return `lch(${l} ${c} ${h}${alpha})`
      }

      case 'oklab': {
        const oklab = toOklab(color)
        if (!oklab) return ''
        const l = formatNumber(oklab.l ?? 0, precision)
        const a = formatNumber(oklab.a ?? 0, precision)
        const b = formatNumber(oklab.b ?? 0, precision)
        const alpha = formatAlpha(oklab.alpha, alphaFormat)
        return `oklab(${l} ${a} ${b}${alpha})`
      }

      case 'oklch': {
        const oklch = toOklch(color)
        if (!oklch) return ''
        const l = formatNumber(oklch.l ?? 0, precision)
        const c = formatNumber(oklch.c ?? 0, precision)
        const h = formatNumber(oklch.h ?? 0, precision)
        const alpha = formatAlpha(oklch.alpha, alphaFormat)
        return `oklch(${l} ${c} ${h}${alpha})`
      }

      default:
        return formatCss(color) ?? ''
    }
  }

  function getAllFormats(
    color: Color,
    options: ConversionOptions = {}
  ): Record<ColorFormat, string> {
    const formats: ColorFormat[] = ['hex', 'rgb', 'hsl', 'hwb', 'lab', 'lch', 'oklab', 'oklch']
    const result = {} as Record<ColorFormat, string>

    for (const format of formats) {
      result[format] = convertToFormat(color, format, options)
    }

    return result
  }

  function convertColor(
    input: string,
    targetFormat: ColorFormat,
    options: ConversionOptions = {}
  ): ConversionResult {
    const parsed = parseColor(input)

    if (!parsed.isValid || !parsed.color) {
      return {
        value: '',
        format: targetFormat,
        isValid: false
      }
    }

    return {
      value: convertToFormat(parsed.color, targetFormat, options),
      format: targetFormat,
      isValid: true
    }
  }

  return {
    parseColor,
    convertColor,
    convertToFormat,
    getAllFormats
  }
}
