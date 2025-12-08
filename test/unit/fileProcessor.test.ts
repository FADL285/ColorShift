import { describe, it, expect, vi } from 'vitest'
import { useFileProcessor } from '../../app/composables/useFileProcessor'

// Mock the useColorConverter composable
vi.mock('../../app/composables/useColorConverter', () => ({
  useColorConverter: () => ({
    convertToFormat: (_color: unknown, targetFormat: string) => {
      // Simple mock that returns a predictable conversion
      if (targetFormat === 'oklch') {
        return 'oklch(0.68 0.17 40)'
      }
      if (targetFormat === 'rgb') {
        return 'rgb(255, 87, 51)'
      }
      return '#ff5733'
    }
  })
}))

describe('useFileProcessor', () => {
  const { detectColors, processFile } = useFileProcessor()

  describe('detectColors', () => {
    it('should detect hex colors', () => {
      const content = '.button { color: #ff5733; }'
      const matches = detectColors(content)
      expect(matches).toHaveLength(1)
      expect(matches[0].original).toBe('#ff5733')
    })

    it('should detect 3-digit hex colors', () => {
      const content = '.button { color: #f53; }'
      const matches = detectColors(content)
      expect(matches).toHaveLength(1)
      expect(matches[0].original).toBe('#f53')
    })

    it('should detect hex with alpha', () => {
      const content = '.button { color: #ff573380; }'
      const matches = detectColors(content)
      expect(matches).toHaveLength(1)
      expect(matches[0].original).toBe('#ff573380')
    })

    it('should detect rgb colors', () => {
      const content = '.button { color: rgb(255, 87, 51); }'
      const matches = detectColors(content)
      expect(matches).toHaveLength(1)
      expect(matches[0].original).toBe('rgb(255, 87, 51)')
    })

    it('should detect rgba colors', () => {
      const content = '.button { color: rgba(255, 87, 51, 0.5); }'
      const matches = detectColors(content)
      expect(matches).toHaveLength(1)
      expect(matches[0].original).toBe('rgba(255, 87, 51, 0.5)')
    })

    it('should detect hsl colors', () => {
      const content = '.button { color: hsl(11, 100%, 60%); }'
      const matches = detectColors(content)
      expect(matches).toHaveLength(1)
      expect(matches[0].original).toBe('hsl(11, 100%, 60%)')
    })

    it('should detect hsla colors', () => {
      const content = '.button { color: hsla(11, 100%, 60%, 0.5); }'
      const matches = detectColors(content)
      expect(matches).toHaveLength(1)
      expect(matches[0].original).toBe('hsla(11, 100%, 60%, 0.5)')
    })

    it('should detect hwb colors', () => {
      const content = '.button { color: hwb(11 20% 0%); }'
      const matches = detectColors(content)
      expect(matches).toHaveLength(1)
      expect(matches[0].original).toBe('hwb(11 20% 0%)')
    })

    it('should detect lab colors', () => {
      const content = '.button { color: lab(62 58 49); }'
      const matches = detectColors(content)
      expect(matches).toHaveLength(1)
      expect(matches[0].original).toBe('lab(62 58 49)')
    })

    it('should detect lch colors', () => {
      const content = '.button { color: lch(62 76 40); }'
      const matches = detectColors(content)
      expect(matches).toHaveLength(1)
      expect(matches[0].original).toBe('lch(62 76 40)')
    })

    it('should detect oklab colors', () => {
      const content = '.button { color: oklab(0.68 0.13 0.11); }'
      const matches = detectColors(content)
      expect(matches).toHaveLength(1)
      expect(matches[0].original).toBe('oklab(0.68 0.13 0.11)')
    })

    it('should detect oklch colors', () => {
      const content = '.button { color: oklch(0.68 0.17 40); }'
      const matches = detectColors(content)
      expect(matches).toHaveLength(1)
      expect(matches[0].original).toBe('oklch(0.68 0.17 40)')
    })

    it('should detect multiple colors', () => {
      const content = `
        .button {
          color: #ff5733;
          background: rgb(255, 87, 51);
          border-color: hsl(11, 100%, 60%);
        }
      `
      const matches = detectColors(content)
      expect(matches).toHaveLength(3)
    })

    it('should return empty array for content without colors', () => {
      const content = '.button { font-size: 16px; }'
      const matches = detectColors(content)
      expect(matches).toHaveLength(0)
    })

    it('should provide line and column numbers', () => {
      const content = '.button { color: #ff5733; }'
      const matches = detectColors(content)
      expect(matches[0].line).toBe(1)
      expect(matches[0].column).toBe(18)
    })

    it('should handle multiline content', () => {
      const content = `.button {
  color: #ff5733;
}`
      const matches = detectColors(content)
      expect(matches[0].line).toBe(2)
    })
  })

  describe('processFile', () => {
    it('should convert colors to target format', () => {
      const content = '.button { color: #ff5733; }'
      const result = processFile(content, { targetFormat: 'oklch' })
      expect(result.converted).toContain('oklch')
      expect(result.stats.total).toBe(1)
      expect(result.stats.converted).toBe(1)
    })

    it('should track conversion statistics', () => {
      const content = `
        .a { color: #ff5733; }
        .b { color: rgb(100, 100, 100); }
        .c { color: hsl(200, 50%, 50%); }
      `
      const result = processFile(content, { targetFormat: 'oklch' })
      expect(result.stats.total).toBe(3)
      expect(result.stats.converted).toBe(3)
    })

    it('should preserve original content structure', () => {
      const content = `.button {
  color: #ff5733;
  font-size: 16px;
}`
      const result = processFile(content, { targetFormat: 'oklch' })
      expect(result.converted).toContain('font-size: 16px')
      expect(result.converted).toContain('.button')
    })

    it('should return changes array with details', () => {
      const content = '.button { color: #ff5733; }'
      const result = processFile(content, { targetFormat: 'oklch' })
      expect(result.changes).toHaveLength(1)
      expect(result.changes[0].original).toBe('#ff5733')
      expect(result.changes[0].converted).toBe('oklch(0.68 0.17 40)')
    })
  })
})
