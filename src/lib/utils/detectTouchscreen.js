export function detectTouchscreen() {
  if (window.PointerEvent && ('maxTouchPoints' in navigator)) {
    // if Pointer Events are supported, just check maxTouchPoints
    if (navigator.maxTouchPoints > 0) return true
  }
  else { // no Pointer Events...
    // check for any-pointer:coarse which mostly means touchscreen
    if (window.matchMedia && window.matchMedia('(any-pointer:coarse)').matches)
      return true
    // last resort - check for exposed touch events API / event handler
    else if (window.TouchEvent || ('ontouchstart' in window))
      return true
  }
  return false
}
