import { useContext } from 'react'

import { MouseContext } from 'core/context/mouse'

/**
 * The useMousePosition hook provides mouse position values using react-spring,
 * resulting in a smoothed, phsyics like interpolation for the mouse position.
 *
 * Additionally, the returned mouse position values are relative to screen size
 * and assume the center of the screen as the origin (0, 0).
 * Mouse x and x value will be in the range [-0.5 -> 0.5]
 */
export function useMouse() {
  return useContext(MouseContext)
}
