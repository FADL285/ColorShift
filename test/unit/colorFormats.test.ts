import { describe, it, expect } from 'vitest'
import { useColorFormats, COLOR_FORMATS } from '../../app/composables/useColorFormats'
import { COLOR_REGEX_PATTERNS } from '../../app/utils/colorPatterns'

describe('useColorFormats', () => {
  const { formats, patterns, detectFormat, getFormatLabel, getFormatExample } = useColorFormats()

  describe('formats and patterns exports', () => {
    it('should export COLOR_FORMATS array with 8 formats', () => {
      expect(formats).toHaveLength(8)
      expect(COLOR_FORMATS).toHaveLength(8)
    })

    it('should export COLOR_REGEX_PATTERNS object with 8 patterns', () => {
      expect(Object.keys(patterns)).toHaveLength(8)
      expect(Object.keys(COLOR_REGEX_PATTERNS)).toHaveLength(8)
    })

    it('should have all format definitions with required properties', () => {
      formats.forEach((format) => {
        expect(format).toHaveProperty('id')
        expect(format).toHaveProperty('label')
        expect(format).toHaveProperty('example')
        expect(format).toHaveProperty('description')
      })
    })
  })

  describe('detectFormat', () => {
    it('should detect hex color with 3 digits', () => {
      expect(detectFormat('#fff')).toBe('hex')
      expect(detectFormat('#FFF')).toBe('hex')
    })

    it('should detect hex color with 6 digits', () => {
      expect(detectFormat('#ff5733')).toBe('hex')
      expect(detectFormat('#FF5733')).toBe('hex')
    })

    it('should detect hex color with alpha (8 digits)', () => {
      expect(detectFormat('#ff573380')).toBe('hex')
    })

    it('should detect rgb color', () => {
      expect(detectFormat('rgb(255, 87, 51)')).toBe('rgb')
      expect(detectFormat('RGB(255, 87, 51)')).toBe('rgb')
    })

    it('should detect rgba color as rgb', () => {
      expect(detectFormat('rgba(255, 87, 51, 0.5)')).toBe('rgb')
      expect(detectFormat('RGBA(255, 87, 51, 0.5)')).toBe('rgb')
    })

    it('should detect hsl color', () => {
      expect(detectFormat('hsl(11, 100%, 60%)')).toBe('hsl')
      expect(detectFormat('HSL(11, 100%, 60%)')).toBe('hsl')
    })

    it('should detect hsla color as hsl', () => {
      expect(detectFormat('hsla(11, 100%, 60%, 0.5)')).toBe('hsl')
    })

    it('should detect hwb color', () => {
      expect(detectFormat('hwb(11 20% 0%)')).toBe('hwb')
      expect(detectFormat('HWB(11 20% 0%)')).toBe('hwb')
    })

    it('should detect lab color', () => {
      expect(detectFormat('lab(62 58 49)')).toBe('lab')
      expect(detectFormat('LAB(62 58 49)')).toBe('lab')
    })

    it('should detect lch color', () => {
      expect(detectFormat('lch(62 76 40)')).toBe('lch')
      expect(detectFormat('LCH(62 76 40)')).toBe('lch')
    })

    it('should detect oklab color', () => {
      expect(detectFormat('oklab(0.68 0.13 0.11)')).toBe('oklab')
      expect(detectFormat('OKLAB(0.68 0.13 0.11)')).toBe('oklab')
    })

    it('should detect oklch color', () => {
      expect(detectFormat('oklch(0.68 0.17 40)')).toBe('oklch')
      expect(detectFormat('OKLCH(0.68 0.17 40)')).toBe('oklch')
    })

    it('should return null for unknown format', () => {
      expect(detectFormat('red')).toBeNull()
      expect(detectFormat('notacolor')).toBeNull()
    })

    it('should return null for empty string', () => {
      expect(detectFormat('')).toBeNull()
    })

    it('should return null for whitespace only', () => {
      expect(detectFormat('   ')).toBeNull()
    })

    it('should handle input with leading/trailing whitespace', () => {
      expect(detectFormat('  #ff5733  ')).toBe('hex')
      expect(detectFormat('  rgb(255, 87, 51)  ')).toBe('rgb')
    })
  })

  describe('getFormatLabel', () => {
    it('should return correct label for hex', () => {
      expect(getFormatLabel('hex')).toBe('HEX')
    })

    it('should return correct label for rgb', () => {
      expect(getFormatLabel('rgb')).toBe('RGB')
    })

    it('should return correct label for hsl', () => {
      expect(getFormatLabel('hsl')).toBe('HSL')
    })

    it('should return correct label for hwb', () => {
      expect(getFormatLabel('hwb')).toBe('HWB')
    })

    it('should return correct label for lab', () => {
      expect(getFormatLabel('lab')).toBe('LAB')
    })

    it('should return correct label for lch', () => {
      expect(getFormatLabel('lch')).toBe('LCH')
    })

    it('should return correct label for oklab', () => {
      expect(getFormatLabel('oklab')).toBe('OKLAB')
    })

    it('should return correct label for oklch', () => {
      expect(getFormatLabel('oklch')).toBe('OKLCH')
    })

    it('should return uppercase for unknown format', () => {
      expect(getFormatLabel('named')).toBe('NAMED')
    })
  })

  describe('getFormatExample', () => {
    it('should return example for hex', () => {
      expect(getFormatExample('hex')).toBe('#ff5733')
    })

    it('should return example for rgb', () => {
      expect(getFormatExample('rgb')).toBe('rgb(255, 87, 51)')
    })

    it('should return example for hsl', () => {
      expect(getFormatExample('hsl')).toBe('hsl(11, 100%, 60%)')
    })

    it('should return example for oklch', () => {
      expect(getFormatExample('oklch')).toBe('oklch(0.68 0.17 40)')
    })

    it('should return empty string for unknown format', () => {
      expect(getFormatExample('named')).toBe('')
    })
  })

  describe('COLOR_REGEX_PATTERNS', () => {
    it('should match hex colors', () => {
      const pattern = new RegExp(COLOR_REGEX_PATTERNS.hex)
      expect('#ff5733').toMatch(pattern)
      expect('#fff').toMatch(pattern)
      expect('#ff573380').toMatch(pattern)
    })

    it('should match rgb colors', () => {
      const pattern = new RegExp(COLOR_REGEX_PATTERNS.rgb)
      expect('rgb(255, 87, 51)').toMatch(pattern)
      expect('rgba(255, 87, 51, 0.5)').toMatch(pattern)
    })

    it('should match hsl colors', () => {
      const pattern = new RegExp(COLOR_REGEX_PATTERNS.hsl)
      expect('hsl(11, 100%, 60%)').toMatch(pattern)
      expect('hsla(11, 100%, 60%, 0.5)').toMatch(pattern)
    })

    it('should match hwb colors', () => {
      const pattern = new RegExp(COLOR_REGEX_PATTERNS.hwb)
      expect('hwb(11 20% 0%)').toMatch(pattern)
    })

    it('should match lab colors', () => {
      const pattern = new RegExp(COLOR_REGEX_PATTERNS.lab)
      expect('lab(62 58 49)').toMatch(pattern)
    })

    it('should match lch colors', () => {
      const pattern = new RegExp(COLOR_REGEX_PATTERNS.lch)
      expect('lch(62 76 40)').toMatch(pattern)
    })

    it('should match oklab colors', () => {
      const pattern = new RegExp(COLOR_REGEX_PATTERNS.oklab)
      expect('oklab(0.68 0.13 0.11)').toMatch(pattern)
    })

    it('should match oklch colors', () => {
      const pattern = new RegExp(COLOR_REGEX_PATTERNS.oklch)
      expect('oklch(0.68 0.17 40)').toMatch(pattern)
    })
  })
})
