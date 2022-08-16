import { useCallback, useEffect, useRef } from 'react'
import { useEventListener } from 'lib/hooks/useEventListener'

export function useScrollEventListener(
  callback,
  enabled = true,
  ref,
) {
  const callbackRef = useRef(null)
  const frameRef = useRef(null)
  const prevScrollTop = useRef(0)

  const stopAnimationFrame = useCallback(() => {
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
    frameRef.current = null
  }, [])

  const update = useCallback(() => {
    if (document.scrollingElement) {
      let scrollProgress
      let scrollTop

      // passing in a ref will make the scrollTop / scrollHeight relative to that ref
      // otherwise defaulting to the document
      if (ref && ref.current) {
        const { top, height } = ref.current.getBoundingClientRect()
        const relativeTop = top + document.scrollingElement.scrollTop
        const viewportScroll = Math.min(relativeTop, window.innerHeight)
        const totalScroll = viewportScroll + height
        scrollTop = viewportScroll - top
        scrollProgress = scrollTop / totalScroll
      } else {
        // eslint-disable-next-line prefer-destructuring
        scrollTop = document.scrollingElement.scrollTop
        const { scrollHeight } = document.scrollingElement
        scrollProgress = scrollTop / (scrollHeight - window.innerHeight)
      }

      callbackRef.current?.({ scrollTop, scrollProgress })
      if (frameRef.current && Math.abs(scrollTop - prevScrollTop.current) > 0.1) {
        prevScrollTop.current = scrollTop
        frameRef.current = window.requestAnimationFrame(update)
        return
      }
    }
    stopAnimationFrame()
  }, [stopAnimationFrame, ref])

  const startAnimationFrame = useCallback(() => {
    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(update)
    }
  }, [update])

  useEffect(() => {
    callbackRef.current = callback
    return stopAnimationFrame
  }, [callback, stopAnimationFrame])

  useEventListener(enabled ? 'scroll' : null, startAnimationFrame, { initial: true })
}
