# ColorShift

A free, privacy-focused color conversion tool for designers and developers. Convert colors between CSS formats instantly and batch-process entire CSS/SASS/PostCSS files—all client-side.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- **Instant Conversion** — Convert colors in real-time as you type with live preview
- **Batch Processing** — Upload CSS/SASS files and convert all colors at once
- **100% Client-Side** — All processing happens in your browser. No data sent to servers
- **All CSS Formats** — Supports HEX, RGB, HSL, HWB, LAB, LCH, OKLAB, OKLCH

## Supported Color Formats

| Format | Example                                          | Description                     |
| ------ | ------------------------------------------------ | ------------------------------- |
| HEX    | `#ff5733`, `#f53`, `#ff573380`                   | Hexadecimal with optional alpha |
| RGB    | `rgb(255, 87, 51)`, `rgba(255, 87, 51, 0.5)`     | Red, Green, Blue                |
| HSL    | `hsl(11, 100%, 60%)`, `hsla(11, 100%, 60%, 0.5)` | Hue, Saturation, Lightness      |
| HWB    | `hwb(11 20% 0%)`                                 | Hue, Whiteness, Blackness       |
| LAB    | `lab(62.83 56.25 46.63)`                         | CIE LAB perceptually uniform    |
| LCH    | `lch(62.83 73.02 39.67)`                         | CIE LCH (cylindrical LAB)       |
| OKLAB  | `oklab(0.68 0.13 0.1)`                           | Oklab perceptually uniform      |
| OKLCH  | `oklch(0.68 0.17 40)`                            | OKLCH (cylindrical Oklab)       |

All formats support alpha channel transparency.

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com) (Vue 3 Composition API)
- **UI**: [Nuxt UI v4](https://ui.nuxt.com)
- **Color Library**: [culori](https://culorijs.org) for parsing and conversion
- **Testing**: [Vitest](https://vitest.dev) + [@nuxt/test-utils](https://nuxt.com/docs/getting-started/testing)
- **Linting**: ESLint 9 + Prettier
- **Git Hooks**: Husky + lint-staged

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/FADL285/ColorShift.git
cd ColorShift

# Install dependencies
npm install
```

### Development

```bash
# Start development server at http://localhost:3000
npm run dev
```

### Build & Deploy

```bash
# Generate static site for production
npm run generate

# Preview production build locally
npm run preview
```

## Scripts

| Script               | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start development server     |
| `npm run build`      | Build for production (SSR)   |
| `npm run generate`   | Generate static site (SSG)   |
| `npm run preview`    | Preview production build     |
| `npm run lint`       | Run ESLint                   |
| `npm run lint:fix`   | Run ESLint with auto-fix     |
| `npm run format`     | Check Prettier formatting    |
| `npm run format:fix` | Auto-fix Prettier formatting |
| `npm run test`       | Run Vitest tests             |

## Project Structure

```
ColorShift/
├── app/
│   ├── components/       # Vue components
│   │   ├── color/        # Color-specific components
│   │   └── Stars*.vue    # Background effects
│   ├── composables/      # Vue composables
│   │   ├── useColorConverter.ts   # Color conversion logic
│   │   ├── useColorFormats.ts     # Format definitions
│   │   └── useFileProcessor.ts    # Batch file processing
│   ├── layouts/          # Page layouts
│   ├── pages/            # Route pages
│   │   ├── index.vue     # Single color converter
│   │   ├── file-converter.vue  # Batch file converter
│   │   └── about.vue     # About page
│   ├── app.config.ts     # App configuration
│   └── app.vue           # Root component
├── public/               # Static assets
├── test/                 # Test files
│   └── unit/             # Unit tests
├── nuxt.config.ts        # Nuxt configuration
└── vitest.config.ts      # Vitest configuration
```

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage
```

## Privacy

ColorShift is built with privacy as a core principle:

- **No Server Processing** — All color conversions happen in your browser using JavaScript
- **No Data Collection** — We don't collect, store, or transmit any of your color values or files
- **No Cookies** — ColorShift doesn't use tracking cookies or analytics
- **Open Source** — The source code is available on GitHub for full transparency

Your files never leave your computer. Everything is processed in your browser's memory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Mohamed Fadl** - [@FADL285](https://github.com/FADL285)

---

Made with ❤️ using [Nuxt](https://nuxt.com) and [culori](https://culorijs.org)
