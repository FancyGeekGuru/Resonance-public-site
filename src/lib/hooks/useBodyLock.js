import { useEffect } from 'react'

export function useBodyLock(bool = true) {
  useEffect(() => {
    if (bool) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [bool])
}

