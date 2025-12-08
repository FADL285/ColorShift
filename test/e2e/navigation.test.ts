import { describe, it, expect } from 'vitest'
import { setup, $fetch, createPage } from '@nuxt/test-utils/e2e'

describe('Navigation & Layout', async () => {
  await setup({
    browser: true,
    browserOptions: {
      type: 'chromium'
    }
  })

  describe('Header Navigation', () => {
    it('renders header with navigation links', async () => {
      const html = await $fetch('/')
      expect(html).toContain('Convert')
      expect(html).toContain('File Converter')
      expect(html).toContain('About')
    })

    it('navigates to file converter page', async () => {
      const page = await createPage('/')

      // Click on File Converter link in the navigation (use exact match to avoid multiple matches)
      await page.getByRole('link', { name: 'File Converter', exact: true }).click()
      await page.waitForURL('**/file-converter')

      // Verify we're on the file converter page
      const url = page.url()
      expect(url).toContain('/file-converter')

      await page.close()
    })

    it('navigates to about page', async () => {
      const page = await createPage('/')

      // Click on About link
      await page.getByRole('link', { name: /About/i }).click()
      await page.waitForURL('**/about')

      // Verify we're on the about page
      const url = page.url()
      expect(url).toContain('/about')

      await page.close()
    })
  })

  describe('Footer', () => {
    it('renders footer with GitHub link', async () => {
      const html = await $fetch('/')
      expect(html).toContain('github.com/FADL285/ColorShift')
    })
  })

  describe('About Page', () => {
    it('renders about page content', async () => {
      const html = await $fetch('/about')
      expect(html).toContain('About')
      expect(html).toContain('ColorShift')
    })

    it('explains supported formats', async () => {
      const html = await $fetch('/about')
      expect(html).toContain('HEX')
      expect(html).toContain('RGB')
      expect(html).toContain('HSL')
    })
  })

  describe('Color Mode Toggle', () => {
    it('has color mode toggle button', async () => {
      const page = await createPage('/')

      // Check if the toggle exists (it may be in the header)
      const pageContent = await page.content()
      expect(pageContent).toMatch(/sun|moon|theme|color-mode/i)

      await page.close()
    })
  })
})
