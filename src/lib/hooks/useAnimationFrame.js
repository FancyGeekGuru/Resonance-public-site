import { useCallback, useEffect, useRef } from 'react'

export const useAnimationFrame = (callback, enabled = true) => {
  // init ref with fake animation frame ID
  const frame = useRef(0)

  const animate = useCallback(() => {
    callback()
    // update ref to new animation frame ID
    frame.current = requestAnimationFrame(animate)
  }, [callback])

  useEffect(() => {
    if (enabled) {
      // update ref to new animation frame ID
      frame.current = requestAnimationFrame(animate)

      // kill animation cycle on component unmount
      return () => cancelAnimationFrame(frame.current)
      // start animation on first render
    }
  }, [animate, enabled])
}
