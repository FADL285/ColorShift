import { describe, it, expect } from 'vitest'
import { setup, createPage } from '@nuxt/test-utils/e2e'
import { readFile } from 'node:fs/promises'
import { parse, converter } from 'culori'

describe('Real browser conversion journeys', async () => {
  await setup({ browser: true, browserOptions: { type: 'chromium' } })

  it('emits valid transparent RGB/HSL preserving channels and recovers from invalid input', async () => {
    const page = await createPage('/')
    try {
      const input = page.locator('input[type="text"]').first()
      await input.fill('rgba(255, 87, 51, 0.5)')
      for (const format of ['rgb', 'hsl']) {
        const output = page.getByTestId(`color-format-${format}`).locator('p[title]')
        await expect.poll(() => output.getAttribute('title')).toMatch(new RegExp(`^${format}\\(`))
        const value = (await output.getAttribute('title'))!
        await expect.poll(() => output.textContent()).toBe(value)
        expect(await page.evaluate((color) => CSS.supports('color', color), value)).toBe(true)
        const actual = converter('rgb')(parse(value)!)!
        expect(actual.alpha).toBeCloseTo(0.5)
        expect(actual.r).toBeCloseTo(1, 2)
        expect(actual.g).toBeCloseTo(87 / 255, 2)
        expect(actual.b).toBeCloseTo(51 / 255, 2)
      }
      await input.fill('not-a-color')
      await input.blur()
      await expect
        .poll(() => page.getByText('Invalid color format', { exact: true }).isVisible())
        .toBe(true)
      await input.fill('#00ff00')
      await expect
        .poll(() => page.getByTestId('color-format-rgb').locator('p').textContent())
        .toBe('rgb(0, 255, 0)')
    } finally {
      await page.close()
    }
  })

  for (const extension of ['css', 'scss', 'postcss']) {
    it(`uploads ${extension}, converts safe literals and downloads exact preserved output`, async () => {
      const page = await createPage('/file-converter')
      try {
        const source = `/* #fff */\n#fff:hover { content: "🎨 #fff"; background-image: url("icons.svg#fff"); color: var(--brand, #fff); box-shadow: 0 0 #000 #{ mix(#000, #fff) }; }`
        const expected = `/* #fff */\n#fff:hover { content: "🎨 #fff"; background-image: url("icons.svg#fff"); color: var(--brand, rgb(255, 255, 255)); box-shadow: 0 0 rgb(0, 0, 0) #{ mix(#000, #fff) }; }`
        await page.getByRole('combobox', { name: 'Target format' }).click()
        await page.getByRole('option', { name: 'RGB', exact: true }).click()
        await page.getByTestId('file-input').setInputFiles({
          name: `fixture.${extension}`,
          mimeType: 'text/css',
          buffer: Buffer.from(source)
        })
        const downloadButton = page.getByRole('button', { name: 'Download Converted File' })
        await expect.poll(() => downloadButton.isEnabled()).toBe(true)
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          downloadButton.click()
        ])
        expect(download.suggestedFilename()).toBe(`fixture-converted.${extension}`)
        expect(await readFile((await download.path())!, 'utf8')).toBe(expected)
        await page.getByRole('button', { name: 'Remove file' }).click()
        await expect
          .poll(() => page.getByText('No file uploaded', { exact: true }).isVisible())
          .toBe(true)
        expect(await downloadButton.count()).toBe(0)
      } finally {
        await page.close()
      }
    })
  }

  it('rejects malformed, unsupported, and oversized files then accepts a valid replacement', async () => {
    const page = await createPage('/file-converter')
    try {
      const input = page.getByTestId('file-input')
      await input.setInputFiles({
        name: 'bad.sass',
        mimeType: 'text/plain',
        buffer: Buffer.from('.a\n  color: #fff')
      })
      await expect
        .poll(() => page.getByText('Invalid file type', { exact: true }).isVisible())
        .toBe(true)
      await input.setInputFiles({
        name: 'large.css',
        mimeType: 'text/css',
        buffer: Buffer.alloc(5 * 1024 * 1024 + 1, ' ')
      })
      await expect
        .poll(() => page.getByText('File too large', { exact: true }).isVisible())
        .toBe(true)
      await input.setInputFiles({
        name: 'bad.css',
        mimeType: 'text/css',
        buffer: Buffer.from('.a { color: #fff;')
      })
      await expect
        .poll(() => page.getByText('Unable to process stylesheet', { exact: true }).isVisible())
        .toBe(true)
      expect(await page.getByRole('button', { name: 'Download Converted File' }).count()).toBe(0)
      await page.getByRole('button', { name: 'Remove file' }).click()
      await page.getByTestId('file-input').setInputFiles({
        name: 'good.css',
        mimeType: 'text/css',
        buffer: Buffer.from('.a { color: #fff; }')
      })
      await expect
        .poll(() => page.getByRole('button', { name: 'Download Converted File' }).isEnabled())
        .toBe(true)
    } finally {
      await page.close()
    }
  })
  it('reruns conversion on alpha settings and clears an empty file safely', async () => {
    const page = await createPage('/file-converter')
    try {
      await page.getByRole('combobox', { name: 'Target format' }).click()
      await page.getByRole('option', { name: 'RGB', exact: true }).click()
      await page.getByTestId('file-input').setInputFiles({
        name: 'alpha.css',
        mimeType: 'text/css',
        buffer: Buffer.from('.a { color: rgba(255, 87, 51, 0.5); }')
      })
      const button = page.getByRole('button', { name: 'Download Converted File' })
      await expect.poll(() => button.isEnabled()).toBe(true)
      await page.getByRole('radio', { name: 'Percentage (50%)', exact: true }).click()
      await expect
        .poll(async () => (await page.locator('pre').allTextContents()).map((text) => text.trim()))
        .toContain('.a { color: rgb(255 87 51 / 50%); }')
      await expect.poll(() => button.isEnabled()).toBe(true)
      const [download] = await Promise.all([page.waitForEvent('download'), button.click()])
      expect(await readFile((await download.path())!, 'utf8')).toBe(
        '.a { color: rgb(255 87 51 / 50%); }'
      )
      await page.getByRole('button', { name: 'Remove file' }).click()
      await page
        .getByTestId('file-input')
        .setInputFiles({ name: 'empty.css', mimeType: 'text/css', buffer: Buffer.from('') })
      expect(await button.count()).toBe(0)
      await page.getByRole('button', { name: 'Remove file' }).click()
      await expect
        .poll(() => page.getByText('No file uploaded', { exact: true }).isVisible())
        .toBe(true)
    } finally {
      await page.close()
    }
  })

  it('cancels processing on reset and ignores a late result from the old worker', async () => {
    const page = await createPage('/file-converter')
    try {
      await page.addInitScript(() => {
        const workers: Array<{
          onmessage: ((event: { data: unknown }) => void) | null
          terminated: boolean
        }> = []
        class ControlledWorker {
          onmessage: ((event: { data: unknown }) => void) | null = null
          onerror = null
          terminated = false
          constructor() {
            workers.push(this)
          }
          postMessage() {}
          terminate() {
            this.terminated = true
          }
        }
        Object.assign(window, { Worker: ControlledWorker, __testWorkers: workers })
      })
      await page.reload()
      await page.getByTestId('file-input').setInputFiles({
        name: 'job.css',
        mimeType: 'text/css',
        buffer: Buffer.from('.a { color: #fff; }')
      })
      await expect
        .poll(() => page.getByText('Processing file...', { exact: true }).isVisible())
        .toBe(true)
      await page.getByRole('button', { name: 'Remove file' }).click()
      const terminated = await page.evaluate(() => {
        const workers = (
          window as unknown as {
            __testWorkers: Array<{
              terminated: boolean
              onmessage: (event: { data: unknown }) => void
            }>
          }
        ).__testWorkers
        workers[0]!.onmessage({
          data: {
            result: {
              original: 'old',
              converted: 'stale',
              changes: [],
              stats: { total: 1, converted: 1, failed: 0 }
            }
          }
        })
        return workers[0]!.terminated
      })
      expect(terminated).toBe(true)
      await expect
        .poll(() => page.getByText('No file uploaded', { exact: true }).isVisible())
        .toBe(true)
      expect(await page.getByRole('button', { name: 'Download Converted File' }).count()).toBe(0)
      expect(await page.getByText('stale', { exact: true }).count()).toBe(0)
    } finally {
      await page.close()
    }
  })
  it('ignores an old completion while a replacement worker is pending', async () => {
    const page = await createPage('/file-converter')
    try {
      await page.addInitScript(() => {
        const workers: Array<{
          onmessage: ((event: { data: unknown }) => void) | null
          terminated: boolean
        }> = []
        class ControlledWorker {
          onmessage: ((event: { data: unknown }) => void) | null = null
          onerror = null
          terminated = false
          constructor() {
            workers.push(this)
          }
          postMessage() {}
          terminate() {
            this.terminated = true
          }
        }
        Object.assign(window, { Worker: ControlledWorker, __testWorkers: workers })
      })
      await page.reload()
      for (const [index, name] of ['first.css', 'second.css'].entries()) {
        if (index > 0) await page.getByRole('button', { name: 'Remove file' }).click()
        await page.getByTestId('file-input').setInputFiles({
          name,
          mimeType: 'text/css',
          buffer: Buffer.from('.a { color: #fff; }')
        })
        await expect
          .poll(() => page.getByText('Processing file...', { exact: true }).isVisible())
          .toBe(true)
      }
      await expect
        .poll(
          () =>
            page.evaluate(() => {
              const workers = (
                window as unknown as { __testWorkers: Array<{ terminated: boolean }> }
              ).__testWorkers
              return { count: workers.length, oldTerminated: workers[0]?.terminated }
            }),
          { timeout: 3000 }
        )
        .toEqual({ count: 2, oldTerminated: true })
      const deliver = async (index: number, converted: string) =>
        page.evaluate(
          ({ index, converted }) => {
            const workers = (
              window as unknown as {
                __testWorkers: Array<{
                  terminated: boolean
                  onmessage: (event: { data: unknown }) => void
                }>
              }
            ).__testWorkers
            workers[index]!.onmessage({
              data: {
                result: {
                  original: 'original',
                  converted,
                  changes: [],
                  stats: { total: 1, converted: 1, failed: 0 }
                }
              }
            })
            return { count: workers.length, oldTerminated: workers[0]!.terminated }
          },
          { index, converted }
        )
      expect(await deliver(0, 'stale')).toEqual({ count: 2, oldTerminated: true })
      expect(await page.getByText('stale', { exact: true }).count()).toBe(0)
      expect(await page.getByText('Processing file...', { exact: true }).isVisible()).toBe(true)
      await deliver(1, 'fresh')
      const button = page.getByRole('button', { name: 'Download Converted File' })
      await expect.poll(() => button.isEnabled()).toBe(true)
      const [download] = await Promise.all([page.waitForEvent('download'), button.click()])
      expect(await readFile((await download.path())!, 'utf8')).toBe('fresh')
    } finally {
      await page.close()
    }
  })
})
