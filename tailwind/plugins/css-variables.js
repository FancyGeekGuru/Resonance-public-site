const plugin = require('tailwindcss/plugin')
const { pageTransitionSpeed } = require('../../src/lib/constants/styles')

module.exports = plugin(({ addBase, theme }) => {
  const layout = theme('layout', {})
  const screens = theme('screens', {})

  const base = {
    ':root': {
      '--vh': '1vh',
      '--layout-max-width': layout.maxWidth,
      '--layout-margin-mobile': layout.margin[0],
      '--layout-margin': layout.margin[1],
      '--layout-gutter': layout.gutter[1],
      '--page-transition-speed': pageTransitionSpeed,
      '--header-safe': 'calc(100vh - var(--header-height))',
    },
  }

  const mobileQuery = `@media screen and (max-width: ${screens.md})`
  base[mobileQuery] = {
    ':root': {
      '--layout-margin': layout.margin[0],
      '--layout-gutter': layout.gutter[0],
    },
  }

  const themes = theme('themes', {})
  const themeNames = Object.keys(themes)
  const colors = theme('colors', {})

  for (const themeName of themeNames) {
    // add color theme css variables
    const themeSelector = `
      .theme-wrapper[data-theme="${themeName}"],
      header[data-theme="${themeName}"]
    `.trim()
    const themeValues = {
      '--background': colors[themes[themeName].background],
      '--foreground': colors[themes[themeName].foreground],
    }
    base[themeSelector] = themeValues


    // add color accent css variables
    const accentSelector = `
      .theme-wrapper[data-accent="${themeName}"],
      header[data-accent="${themeName}"],
    `.trim()
    const accentValues = { '--accent': colors[themeName] }
    base[accentSelector] = accentValues
  }

  addBase(base)
})
