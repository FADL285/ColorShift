import { describe, it, expect, vi } from 'vitest'
import { useColorConverter } from '../../app/composables/useColorConverter'

// Mock the useColorFormats composable
vi.mock('../../app/composables/useColorFormats', () => ({
  useColorFormats: () => ({
    detectFormat: (input: string) => {
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
  })
}))

describe('useColorConverter', () => {
  const { parseColor, convertColor, getAllFormats } = useColorConverter()

  describe('parseColor', () => {
    it('should parse valid hex color', () => {
      const result = parseColor('#ff5733')
      expect(result.isValid).toBe(true)
      expect(result.format).toBe('hex')
      expect(result.original).toBe('#ff5733')
    })

    it('should parse 3-digit hex color', () => {
      const result = parseColor('#f53')
      expect(result.isValid).toBe(true)
      expect(result.format).toBe('hex')
    })

    it('should parse hex with alpha', () => {
      const result = parseColor('#ff573380')
      expect(result.isValid).toBe(true)
      expect(result.format).toBe('hex')
    })

    it('should parse valid rgb color', () => {
      const result = parseColor('rgb(255, 87, 51)')
      expect(result.isValid).toBe(true)
      expect(result.format).toBe('rgb')
    })

    it('should parse rgba color', () => {
      const result = parseColor('rgba(255, 87, 51, 0.5)')
      expect(result.isValid).toBe(true)
      expect(result.format).toBe('rgb')
    })

    it('should parse valid hsl color', () => {
      const result = parseColor('hsl(11, 100%, 60%)')
      expect(result.isValid).toBe(true)
      expect(result.format).toBe('hsl')
    })

    it('should parse hwb color', () => {
      const result = parseColor('hwb(11 20% 0%)')
      expect(result.isValid).toBe(true)
      expect(result.format).toBe('hwb')
    })

    it('should parse lab color', () => {
      const result = parseColor('lab(62 58 49)')
      expect(result.isValid).toBe(true)
      expect(result.format).toBe('lab')
    })

    it('should parse lch color', () => {
      const result = parseColor('lch(62 76 40)')
      expect(result.isValid).toBe(true)
      expect(result.format).toBe('lch')
    })

    it('should parse oklab color', () => {
      const result = parseColor('oklab(0.68 0.13 0.11)')
      expect(result.isValid).toBe(true)
      expect(result.format).toBe('oklab')
    })

    it('should parse oklch color', () => {
      const result = parseColor('oklch(0.68 0.17 40)')
      expect(result.isValid).toBe(true)
      expect(result.format).toBe('oklch')
    })

    it('should return invalid for empty string', () => {
      const result = parseColor('')
      expect(result.isValid).toBe(false)
      expect(result.format).toBeNull()
    })

    it('should return invalid for whitespace only', () => {
      const result = parseColor('   ')
      expect(result.isValid).toBe(false)
    })

    it('should return invalid for invalid color string', () => {
      const result = parseColor('notacolor')
      expect(result.isValid).toBe(false)
    })
  })

  describe('convertColor', () => {
    it('should convert hex to rgb', () => {
      const result = convertColor('#ff5733', 'rgb')
      expect(result.isValid).toBe(true)
      expect(result.format).toBe('rgb')
      expect(result.value).toBe('rgb(255, 87, 51)')
    })

    it('should convert hex to hsl', () => {
      const result = convertColor('#ff5733', 'hsl')
      expect(result.isValid).toBe(true)
      expect(result.format).toBe('hsl')
      expect(result.value).toMatch(/^hsl\(/)
    })

    it('should convert rgb to hex', () => {
      const result = convertColor('rgb(255, 87, 51)', 'hex')
      expect(result.isValid).toBe(true)
      expect(result.value).toBe('#ff5733')
    })

    it('should convert with alpha', () => {
      const result = convertColor('rgba(255, 87, 51, 0.5)', 'hex')
      expect(result.isValid).toBe(true)
      expect(result.value).toBe('#ff573380')
    })

    it('should return invalid result for invalid input', () => {
      const result = convertColor('notacolor', 'hex')
      expect(result.isValid).toBe(false)
      expect(result.value).toBe('')
    })
  })

  describe('getAllFormats', () => {
    it('should return all formats for a valid color', () => {
      const parsed = parseColor('#ff5733')
      if (parsed.color) {
        const formats = getAllFormats(parsed.color)
        expect(formats.hex).toBe('#ff5733')
        expect(formats.rgb).toBe('rgb(255, 87, 51)')
        expect(formats.hsl).toMatch(/^hsl\(/)
        expect(formats.hwb).toMatch(/^hwb\(/)
        expect(formats.lab).toMatch(/^lab\(/)
        expect(formats.lch).toMatch(/^lch\(/)
        expect(formats.oklab).toMatch(/^oklab\(/)
        expect(formats.oklch).toMatch(/^oklch\(/)
      }
    })

    it('should preserve alpha in all formats', () => {
      const parsed = parseColor('rgba(255, 87, 51, 0.5)')
      if (parsed.color) {
        const formats = getAllFormats(parsed.color)
        expect(formats.hex).toContain('80') // alpha in hex
        expect(formats.rgb).toContain('/')
        expect(formats.hsl).toContain('/')
      }
    })
  })
})
