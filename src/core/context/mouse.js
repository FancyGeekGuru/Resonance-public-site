/**
 * Mouse context. Components wrapped in MouseProvider have
 * access to a smoothed mouse position that is defined relative to the screen
 * size using float values in the range -0.5->0.5, with the center of the screen
 * (the origin) at `{ x: 0, y: 0 }`.
 */

import { Controller } from '@react-spring/core'
import React, { createContext, useCallback, useEffect, useMemo } from 'react'
import { detectTouchscreen } from 'lib/utils/detectTouchscreen'

const defaultValue = { x: 0.5, y: 0.5, init: 0, clicked: 0 }
const defaultController = new Controller(defaultValue)

// Context
export const MouseContext = createContext(defaultController)

// Provider
export const MouseProvider = ({ config, ...rest }) => {
  const mouseController = useMemo(
    () => new Controller({ ...defaultValue, config }),
    [config],
  )

  const updateMousePosition = useCallback((mouseX, mouseY) => {
    const { innerWidth: width, innerHeight: height } = window

    // compute relative mouse positions [0 -> 1]
    const mouse = { x: mouseX / width, y: mouseY / height }

    // only update spring if mouse has moved since last update
    const { x, y } = mouseController.springs
    const mouseHasMoved = Math.abs(x.goal - mouse.x) > 1 / width
      || Math.abs(y.goal - mouse.y) > 1 / height
    if (mouseHasMoved) mouseController.start(mouse)
  }, [mouseController])

  const handleMouseMove = useCallback((event) => {
    const { clientX: mouseX, clientY: mouseY } = event
    updateMousePosition(mouseX, mouseY)
  }, [updateMousePosition])

  const handleMouseOver = useCallback(() => {
    if (!detectTouchscreen()) mouseController.start({ init: 1 })
  }, [mouseController])

  const handleMouseLeave = useCallback(() => {
    mouseController.start({ init: 0 })
  }, [mouseController])

  const handleMouseDown = useCallback(() => {
    mouseController.start({ clicked: 1 })
  }, [mouseController])

  const handleMouseUp = useCallback(() => {
    mouseController.start({ clicked: 0 })
  }, [mouseController])

  const handleTouchStart = useCallback((event) => {
    mouseController.start({ clicked: 1 })
    const { touches } = event
    const { clientX, clientY } = touches[0]
    updateMousePosition(clientX, clientY)
  }, [mouseController, updateMousePosition])

  const handleTouchEnd = useCallback(() => {
    mouseController.start({ clicked: 0 })
  }, [mouseController])

  const handleTouchMove = useCallback((event) => {
    const { touches } = event
    const { clientX, clientY } = touches[0]
    updateMousePosition(clientX, clientY)
  }, [updateMousePosition])

  // apply event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mouseout', handleMouseLeave)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchmove', handleTouchMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mouseout', handleMouseLeave)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  },
  [
    handleMouseDown,
    handleMouseLeave,
    handleMouseMove,
    handleMouseOver,
    handleMouseUp,
    handleTouchEnd,
    handleTouchMove,
    handleTouchStart,
  ])

  return <MouseContext.Provider value={mouseController} {...rest} />
}
