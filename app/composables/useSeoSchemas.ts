/**
 * SEO Schemas composable for ColorShift
 * Provides structured data (JSON-LD) for improved search engine visibility
 */
export function useSeoSchemas() {
  const appConfig = useAppConfig()

  /**
   * WebApplication schema for the color converter tool
   * @see https://schema.org/WebApplication
   */
  const webApplicationSchema = {
    '@type': 'WebApplication',
    name: appConfig.name,
    url: appConfig.url,
    description:
      'Free online color converter tool. Convert colors between HEX, RGB, HSL, OKLCH, LAB, LCH, OKLAB, and HWB formats. Batch process CSS/SASS files. 100% client-side, privacy-focused.',
    applicationCategory: 'UtilitiesApplication',
    applicationSubCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Works in all modern browsers.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      'HEX to RGB conversion',
      'RGB to HEX conversion',
      'HEX to HSL conversion',
      'HSL to HEX conversion',
      'HEX to OKLCH conversion',
      'OKLCH to HEX conversion',
      'RGB to OKLCH conversion',
      'OKLCH to RGB conversion',
      'RGB to HSL conversion',
      'HSL to RGB conversion',
      'LAB color space conversion',
      'LCH color space conversion',
      'OKLAB color format support',
      'OKLCH modern color format',
      'HWB color format support',
      'Alpha channel transparency support',
      'Batch CSS file color conversion',
      'SASS file color conversion',
      'PostCSS file color conversion',
      'Real-time color preview',
      'Copy to clipboard functionality',
      'Side-by-side diff preview'
    ],
    author: {
      '@type': 'Person',
      name: appConfig.author,
      url: appConfig.repository
    },
    license: 'https://opensource.org/licenses/MIT',
    isAccessibleForFree: true,
    inLanguage: 'en'
  }

  /**
   * FAQ items for the About page
   * Common questions about color conversion and the tool
   */
  const faqItems = [
    {
      question: 'What color formats does ColorShift support?',
      answer:
        'ColorShift supports HEX, RGB, RGBA, HSL, HSLA, HWB, LAB, LCH, OKLAB, OKLCH, and CSS named colors. All formats support alpha channel transparency.'
    },
    {
      question: 'Is ColorShift free to use?',
      answer:
        'Yes, ColorShift is completely free and open source under the MIT license. There are no usage limits or premium features.'
    },
    {
      question: 'Does ColorShift store my data?',
      answer:
        'No. All color conversions happen entirely in your browser using JavaScript. No data is sent to any server, no cookies are used, and no information is collected.'
    },
    {
      question: 'Can I convert entire CSS files?',
      answer:
        'Yes, ColorShift offers batch file conversion. Upload your CSS, SASS, or PostCSS files and convert all color values to your preferred format at once.'
    },
    {
      question: 'What is OKLCH and why should I use it?',
      answer:
        'OKLCH is a perceptually uniform color space that provides more intuitive color manipulation. It is recommended for modern CSS as it produces more natural color transitions and better accessibility contrast calculations.'
    },
    {
      question: 'How do I convert HEX to OKLCH?',
      answer:
        'Enter your HEX color (e.g., #ff5733) in the ColorShift converter and instantly see the OKLCH equivalent. You can also batch convert entire CSS files from HEX to OKLCH.'
    },
    {
      question: 'How do I convert RGB to HSL?',
      answer:
        'Simply paste your RGB color value (e.g., rgb(255, 87, 51)) into ColorShift and you will instantly see the HSL conversion along with all other supported formats.'
    },
    {
      question: 'What browsers does ColorShift support?',
      answer:
        'ColorShift works in all modern browsers including Chrome, Firefox, Safari, and Edge. It requires JavaScript to be enabled.'
    }
  ]

  return {
    webApplicationSchema,
    faqItems
  }
}
