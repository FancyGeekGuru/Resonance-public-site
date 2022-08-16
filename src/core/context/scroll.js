/**
 * Scroll Position context. Components wrapped in ScrollProvider have
 * access to smoothed scroll `position` and `progress` values.
 * The `position` value respresents actual pixel scroll distance, while
 * the `progress` value respresents relative scroll position within the page.
 */

import { Controller } from '@react-spring/core'
import { getScrollProgress } from 'lib/utils/getScrollProgress'
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useInView } from 'react-intersection-observer'

const defaultValue = {
  controller: new Controller({ position: 0, progress: 0 }),
}

// Context
export const ScrollContext = createContext(defaultValue)

// Provider
export const ScrollProvider = ({
  config,
  includeScrollIn = false,
  includeScrollOut = false,
  getHeaderHeight,
  ...rest
}) => {
  const onUpdateRef = useRef(null)
  const scrollController = useMemo(() => new Controller({
    position: 0,
    progress: 0,
    config,
    onChange: () => onUpdateRef.current?.(),
  }), [config])
  const [inViewRef, inView] = useInView()
  const scrollRef = useRef(null)

  const handleScroll = useCallback(() => {
    const headerHeight = getHeaderHeight?.() ?? 0
    if (scrollRef.current && document.scrollingElement) {
      const { position, progress } = getScrollProgress(
        scrollRef.current,
        includeScrollIn,
        includeScrollOut,
        headerHeight,
      )

      // only update spring if the scroll position has changed since last update
      const {
        springs: {
          position: { goal: positionGoal },
        },
      } = scrollController

      if (positionGoal !== position) {
        scrollController.start({ position, progress })
      }
    }
  }, [getHeaderHeight, includeScrollIn, includeScrollOut, scrollController])

  const setRefs = useCallback(
    (element) => {
      inViewRef(element)
      scrollRef.current = element
    },
    [inViewRef],
  )

  // apply event listeners
  useEffect(() => {
    if (inView) {
      handleScroll()
      window.addEventListener('scroll', handleScroll)
    }
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll, inView])

  return (
    <div ref={setRefs}>
      <ScrollContext.Provider
        value={{ controller: scrollController, onUpdateRef }}
        {...rest}
      />
    </div>
  )
}
