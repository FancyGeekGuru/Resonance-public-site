import { clamp } from 'lib/utils/clamp'

export const getScrollProgress = (
  element,
  includeScrollIn = false,
  includeScrollOut = false,
  headerHeight = 0,
) => {
  const { top, height } = element.getBoundingClientRect()
  const relativeTop = top + document.scrollingElement.scrollTop
  const viewportScroll = includeScrollIn
    ? Math.min(relativeTop, window.innerHeight)
    : headerHeight
  const totalScroll = viewportScroll
            + height
            - (includeScrollOut ? 0 : window.innerHeight - headerHeight)

  const position = viewportScroll - top
  const progress = clamp(
    totalScroll === 0 ? 0 : position / totalScroll,
    0,
    1,
  )
  return { position, progress }
}
