const plugin = require('tailwindcss/plugin')

module.exports = plugin(({ addUtilities, theme }) => {
  const container = theme('container', {})

  addUtilities({
    '.container': {
      marginInline: 'auto',
      maxWidth: container.maxWidth,
      paddingLeft: container.padding,
      paddingRight: container.padding,
      width: '100%',
    },
  })
})
