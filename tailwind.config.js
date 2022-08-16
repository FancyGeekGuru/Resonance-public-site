const theme = require('./tailwind/theme')

module.exports = {
  theme,
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  plugins: [
    require('./tailwind/plugins/css-variables'),
    require('@tailwindcss/forms'),
  ],
  // disable default tailwind container plugin in favor of custom container plugin
  corePlugins: { container: false },
}
