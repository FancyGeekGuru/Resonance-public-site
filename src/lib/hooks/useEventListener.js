import { useEffect, useRef } from 'react'

/**
 * Hook for creating event listeners.
 * @param {string} eventType - type of event to listen for
 * @param {function} callback - event handler callback method
 * @param {Object} [options] - options object
 * @param {Object} [options.target=window] - the event target element. If null,
 *   window will be used as the target.
 * @param {boolean} [options.initial=false] - If true, the callback method will
 *   be called once on initilization. Note: callback should handle not having an
 *   event object passed to it.
 */
export function useEventListener(
  eventType,
  callback,
  options,
) {
  const { target, initial = false } = options ?? {}
  const callbackRef = useRef(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (eventType) {
      const targetElement = target || window
      const eventListener = (event) => {
        if (callbackRef.current) {
          callbackRef.current(event)
        }
      }

      if (initial) eventListener()
      // Attach event to target
      targetElement.addEventListener(eventType, eventListener)
      // Remove event on cleanup
      return () => targetElement.removeEventListener(eventType, eventListener)
    }
  }, [eventType, initial, target])
}
