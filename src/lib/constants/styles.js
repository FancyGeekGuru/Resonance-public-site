const { pxToEm } = require('../utils/pxToRelUnit')

/**
 * Global breakpoint values.
 */
const breakpoints = {
  sm: 640,
  md: 960,
  lg: 1280,
}

/**
 * Global breakpoint values converrted to 'em' units, used to scaffold Tailwind
 * screen widths and `mediaQueries` utility.
 */
const breakpointsEm = {
  ...Object.fromEntries(
    Object.entries(breakpoints).map(([key, value]) => [key, pxToEm(value)]),
  ),
}

/**
 * Speed used for PageTransition component, in milliseconds.
 */
const pageTransitionSpeed = 500

module.exports = {
  breakpoints,
  breakpointsEm,
  pageTransitionSpeed,
}
