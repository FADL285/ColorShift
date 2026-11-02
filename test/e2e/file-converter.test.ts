import { describe, it, expect } from 'vitest'
import { setup, createPage, $fetch } from '@nuxt/test-utils/e2e'

async function renderedHtml(path: string) {
  const page = await createPage(path)
  try {
    return await page.content()
  } finally {
    await page.close()
  }
}

describe('File Converter Page', async () => {
  await setup({
    browser: true,
    browserOptions: {
      type: 'chromium'
    }
  })

  it('serves page text in the raw server HTML response', async () => {
    const html = await $fetch('/file-converter')
    expect(html).toContain('Batch Convert CSS Files')
    expect(html).toContain('Upload')
    expect(html).toContain('Target Format')
  })

  describe('Rendered page', () => {
    it('returns HTML with correct title', async () => {
      const html = await renderedHtml('/file-converter')
      expect(html).toContain('Batch Convert CSS Files')
    })

    it('renders upload section', async () => {
      const html = await renderedHtml('/file-converter')
      expect(html).toContain('Upload')
    })

    it('renders settings section', async () => {
      const html = await renderedHtml('/file-converter')
      expect(html).toContain('Target Format')
    })
  })

  describe('Browser Interactions', () => {
    it('loads page successfully', async () => {
      const page = await createPage('/file-converter')
      const title = await page.title()
      expect(title).toContain('ColorShift')
      expect(title).toContain('Batch')
      await page.close()
    })

    it('has target format selector', async () => {
      const page = await createPage('/file-converter')

      // Check for format selector
      const pageContent = await page.content()
      expect(pageContent).toContain('oklch')

      await page.close()
    })

    it('shows empty state initially', async () => {
      const page = await createPage('/file-converter')

      // Should show upload prompt or empty state
      const pageContent = await page.content()
      expect(pageContent).toContain('Upload')

      await page.close()
    })
  })
})
