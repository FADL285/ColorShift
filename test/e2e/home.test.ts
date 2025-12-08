import { describe, it, expect } from 'vitest'
import { setup, $fetch, createPage } from '@nuxt/test-utils/e2e'

describe('Home Page - Color Converter', async () => {
  await setup({
    browser: true,
    browserOptions: {
      type: 'chromium'
    }
  })

  describe('Server Rendering', () => {
    it('returns HTML with correct title', async () => {
      const html = await $fetch('/')
      expect(html).toContain('ColorShift')
      expect(html).toContain('Convert Colors Between CSS Formats')
    })

    it('renders hero section', async () => {
      const html = await $fetch('/')
      expect(html).toContain('Try Converter')
      expect(html).toContain('View on GitHub')
    })

    it('renders demo color palette', async () => {
      const html = await $fetch('/')
      expect(html).toContain('Coral')
      expect(html).toContain('Blue')
      expect(html).toContain('Green')
    })
  })

  describe('Browser Interactions', () => {
    it('loads page successfully', async () => {
      const page = await createPage('/')
      const title = await page.title()
      expect(title).toContain('ColorShift')
      await page.close()
    })

    it('has color input field', async () => {
      const page = await createPage('/')
      const input = page.locator('input[type="text"]').first()
      const isVisible = await input.isVisible()
      expect(isVisible).toBe(true)
      await page.close()
    })

    it('shows format outputs when valid color is entered', async () => {
      const page = await createPage('/')

      // Find and fill the color input
      const input = page.locator('input[type="text"]').first()
      await input.fill('#ff5733')

      // Wait for debounce and conversion
      await page.waitForTimeout(300)

      // Check that format outputs are shown
      const pageContent = await page.content()
      expect(pageContent).toContain('rgb(255')
      expect(pageContent).toContain('hsl(')

      await page.close()
    })

    it('demo color buttons fill input', async () => {
      const page = await createPage('/')

      // Click on a demo color button (Coral - #ff5733)
      const coralButton = page.getByText('Coral')
      await coralButton.click()

      // Wait for input update
      await page.waitForTimeout(100)

      // Check input value contains the hex color
      const input = page.locator('input[type="text"]').first()
      const value = await input.inputValue()
      expect(value.toLowerCase()).toBe('#ff5733')

      await page.close()
    })
  })
})
