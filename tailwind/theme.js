// Base theme for Tailwind
const { pxToRem } = require('../src/lib/utils/pxToRelUnit')
const { breakpointsEm } = require('../src/lib/constants/styles')

module.exports = {
  // Global layout settings, applied to container and spacing utils.
  layout: {
    maxWidth: pxToRem(1672),
    margin: [20, 50].map(pxToRem),
    gutter: [10, 26].map(pxToRem),
  },

  // Breakpoints for Tailwind's responsive utils.
  screens: breakpointsEm,

  // Font families. `@font-face` definitions are in `src/styles/fonts.css`.
  fontFamily: {
    display: ['Helvetica', 'serif'],
  },

  // Color Theme definitions
  themes: {
    white: {
      background: 'white',
      foreground: 'black',
    },
    black: {
      background: 'black',
      foreground: 'white',
    },
    aquamarine: {
      background: 'aquamarine',
      foreground: 'white',
    },
    pink: {
      background: 'pink',
      foreground: 'black',
    },
    yellow: {
      background: 'yellow',
      foreground: 'black',
    },
  },

  // Colors overrides for Tailwind's color utils.
  colors: {
    // NEW COLORS
    yellow: '#FFE205',
    aquamarine: '#14C9E0',
    pink: '#DE187D',
    gray: '#C6C4C1',
    white: '#fff',
    black: '#000',
    foreground: 'var(--foreground)',
    background: 'var(--background)',
    accent: 'var(--accent)',
    transparent: 'transparent',
    current: 'currentColor',

    // OLD COLORS
    forest: {
      100: '#10230F',
      200: '#183417',
    },
    lime: {
      100: '#009700',
      200: '#18BA11',
      300: '#41D33B',
    },
    lemon: '#D5F704',
    blue: {
      100: '#14B7EB',
      200: '#48D2FF',
    },
    grey: {
      100: '#575757',
      200: '#959595',
      300: '#eee',
    },
  },

  // Border radii values.
  borderRadius: {
    DEFAULT: pxToRem(40),
    full: '9999px',
  },

  // Extensions of Tailwind's base styles.
  extend: {
    backgroundImage: {
      'white-shadow': 'radial-gradient(rgba(255, 255, 255, 0.5), transparent, transparent)',
    },
    spacing: {
      sm: pxToRem(8),
      md: pxToRem(16),
      lg: pxToRem(32),
      xl: pxToRem(64),
      gutter: 'var(--layout-gutter)',
      margin: 'var(--layout-margin)',
      'container-width': 'var(--layout-max-width)',
      'header-height': 'var(--header-height)',
      'header-safe': 'var(--header-safe)',
      'screen-min': '100vmin',
      'screen-max': '100vmax',
      'screen-responsive': 'calc(100 * var(--vh))',
    },
    dropShadow: {
      DEFAULT: '0px -1px 60px rgba(0, 0, 0, 0.6)',
    },
    boxShadow: {
      border: '0 1px 0 0 rgba(0, 0, 0, 0.1)',
      'border-invert': '0 1px 0 0 rgba(255, 255, 255, 0.1)',
    },
    height: {
      'screen-responsive': 'calc(100 * var(--vh))',
      'screen-1/3': '33.33vh',
      'screen-1/4': '25vh',
      'screen-1/2': '50vh',
      'screen-3/4': '75vh',
    },
    minHeight: {
      'screen-responsive': 'calc(100 * var(--vh))',
      'screen-1/3': '33.33vh',
      'screen-1/4': '25vh',
      'screen-1/2': '50vh',
      'screen-3/4': '75vh',
    },
    maxHeight: {
      'screen-responsive': 'calc(100 * var(--vh))',
      'screen-1/3': '33.33vh',
      'screen-1/4': '25vh',
      'screen-1/2': '50vh',
      'screen-3/4': '75vh',
    },
    transitionTimingFunction: {
      ease: 'ease',
    },
    keyframes: {
      'appear-up': {
        '0%': {
          opacity: '0',
          transform: 'translateY(1vh)',
        },
        '100%': {
          opacity: '1',
          transform: 'translateY(0)',
        },
      },
      hexpulse: {
        '0%': {
          transform: 'scale(1)',
        },
        '75%': {
          transform: 'scale(0.8)',
        },
        '100%': {
          transform: 'scale(1)',
        },
      },
      'fill-up': {
        '0%': {
          transform: 'translateY(100%)',
        },
        '100%': {
          transform: 'translateY(0)',
        },
      },
      'draw-line': {
        '0%': {
          'stroke-dasharray': '100',
          'stroke-dashoffset': '100',
        },
        '100%': {
          'stroke-dasharray': '100',
          'stroke-dashoffset': '0',
        },
      },
      'zoom-in': {
        '0%': {
          transform: 'scale(1)',
        },
        '100%': {
          transform: 'scale(1.5)',
        },
      },
      'scale-up': {
        '0%': {
          transform: 'scale(0.1)',
        },
        '100%': {
          transform: 'scale(1)',
        },
      },
    },
  },
}
