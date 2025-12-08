export default defineAppConfig({
  // App metadata
  name: 'ColorShift',
  description: 'Convert colors between CSS formats instantly',
  author: 'Mohamed Fadl',
  repository: 'https://github.com/fadl285/color-shift',

  // Nuxt UI customizations
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'slate'
    },
    // Button - add cursor pointer
    button: {
      slots: {
        base: 'cursor-pointer'
      }
    }
  }
})
