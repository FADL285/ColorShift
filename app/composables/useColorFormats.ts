// Import patterns from centralized utility file for internal use
// Note: COLOR_REGEX_PATTERNS is auto-imported from ~/utils/colorPatterns
import { COLOR_REGEX_PATTERNS } from '~/utils/colorPatterns'

export type ColorFormat =
  | 'hex'
  | 'rgb'
  | 'hsl'
  | 'hwb'
  | 'lab'
  | 'lch'
  | 'oklab'
  | 'oklch'
  | 'named'

export interface ColorFormatDefinition {
  id: ColorFormat
  label: string
  example: string
  description: string
}

export const COLOR_FORMATS: ColorFormatDefinition[] = [
  { id: 'hex', label: 'HEX', example: '#ff5733', description: 'Hexadecimal color notation' },
  { id: 'rgb', label: 'RGB', example: 'rgb(255, 87, 51)', description: 'Red, Green, Blue values' },
  {
    id: 'hsl',
    label: 'HSL',
    example: 'hsl(11, 100%, 60%)',
    description: 'Hue, Saturation, Lightness'
  },
  { id: 'hwb', label: 'HWB', example: 'hwb(11 20% 0%)', description: 'Hue, Whiteness, Blackness' },
  { id: 'lab', label: 'LAB', example: 'lab(62 58 49)', description: 'CIE LAB color space' },
  { id: 'lch', label: 'LCH', example: 'lch(62 76 40)', description: 'Lightness, Chroma, Hue' },
  {
    id: 'oklab',
    label: 'OKLAB',
    example: 'oklab(0.68 0.13 0.11)',
    description: 'OK perceptual LAB'
  },
  { id: 'oklch', label: 'OKLCH', example: 'oklch(0.68 0.17 40)', description: 'OK perceptual LCH' }
]

export function useColorFormats() {
  const formats = COLOR_FORMATS
  const patterns = COLOR_REGEX_PATTERNS

  function detectFormat(input: string): ColorFormat | null {
    const trimmed = input.trim().toLowerCase()

    if (trimmed.startsWith('#')) return 'hex'
    if (trimmed.startsWith('rgba') || trimmed.startsWith('rgb')) return 'rgb'
    if (trimmed.startsWith('hsla') || trimmed.startsWith('hsl')) return 'hsl'
    if (trimmed.startsWith('hwb')) return 'hwb'
    if (trimmed.startsWith('lab(')) return 'lab'
    if (trimmed.startsWith('lch(')) return 'lch'
    if (trimmed.startsWith('oklab')) return 'oklab'
    if (trimmed.startsWith('oklch')) return 'oklch'

    return null
  }

  function getFormatLabel(format: ColorFormat): string {
    return formats.find((f) => f.id === format)?.label ?? format.toUpperCase()
  }

  function getFormatExample(format: ColorFormat): string {
    return formats.find((f) => f.id === format)?.example ?? ''
  }

  return {
    formats,
    patterns,
    detectFormat,
    getFormatLabel,
    getFormatExample
  }
}
