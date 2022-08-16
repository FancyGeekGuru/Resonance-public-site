import { useContext, useEffect } from 'react'

import { ScrollContext } from 'core/context/scroll'

/**
 * The useScroll hook provides mouse position values using react-spring,
 * resulting in a smoothed, phsyics like interpolation for the mouse position.
 *
 * Additionally, the returned mouse position values are relative to screen size
 * and assume the center of the screen as the origin (0, 0).
 * Mouse x and x value will be in the range [-0.5 -> 0.5]
 */
export function useScroll(onUpdate) {
  const context = useContext(ScrollContext)

  useEffect(() => {
    if (context.onUpdateRef && onUpdate)
      context.onUpdateRef.current = onUpdate
  }, [onUpdate, context.onUpdateRef])

  return context
}
