export default defineAppConfig({
  // App metadata
  name: 'ColorShift',
  description: 'Convert colors between CSS formats instantly',
  url: 'https://colorshift.fadl.info',
  author: 'Mohamed Fadl',
  repository: 'https://github.com/FADL285/ColorShift',

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
