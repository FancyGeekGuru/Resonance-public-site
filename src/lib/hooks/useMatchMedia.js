import { useEffect, useState } from 'react'

export function useMatchMedia(mediaQuery) {
  const [matches, setMatches] = useState(null)

  useEffect(() => {
    const onChange = (event) => setMatches(event.matches)
    const mediaQueryList = window.matchMedia(mediaQuery)

    setMatches(mediaQueryList.matches)
    mediaQueryList.addEventListener('change', onChange)
    return () => {
      mediaQueryList.removeEventListener('change', onChange)
    }

  }, [mediaQuery])

  return matches
}
