import { breakpointsEm } from 'lib/constants/styles'

const mediaQueryMap = new Map()

for (const key in breakpointsEm) {
  mediaQueryMap.set(key, `(min-width: ${breakpointsEm[key]})`)
}

mediaQueryMap.set('landscape', '(min-aspect-ratio: 1/1)')

/**
 * MediaQuery string aliases for `useMatchMedia`, derived from `breakpointsEm` constant.
 */
export const mediaQueries = Object.fromEntries(mediaQueryMap)
