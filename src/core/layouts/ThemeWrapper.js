import { useScrollEventListener } from 'lib/hooks/useScrollEventListener'
import { node, string } from 'prop-types'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { colors, themes } from '../../../tailwind/theme'

const themeNames = Object.keys(themes)

export function ThemeWrapper({ children, defaultTheme }) {
  const wrapperRef = useRef()
  const [inViewRef, inView] = useInView()
  const themeRef = useRef(null)
  const [theme, setTheme] = useState(defaultTheme ?? themeNames[0])

  const style = useMemo(() => ({
    '--foreground': colors[themes[theme]?.foreground],
    '--background': colors[themes[theme]?.background],
  }), [theme])

  const handleScroll = useCallback(() => {
    if (wrapperRef.current) {
      const currentThemeWrapper = document
        .elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2)
        .find((element) => element.tagName.toLocaleLowerCase() === 'section'
            && element.parentNode === wrapperRef.current)
      const currentTheme = currentThemeWrapper?.dataset?.theme
      if (currentTheme && themeRef.current !== currentTheme) setTheme(currentTheme)
    }
  }, [setTheme])

  const setRefs = useCallback((element) => {
    inViewRef(element)
    wrapperRef.current = element
  }, [inViewRef])

  useScrollEventListener(handleScroll, inView)

  return (
    <div
      ref={setRefs}
      className="
        theme-wrapper bg-background text-foreground
        transition-colors duration-500 ease-ease
      "
      data-theme={theme}
      style={style}
    >
      {children}
    </div>
  )
}

ThemeWrapper.propTypes = {
  children: node,
  defaultTheme: string,
}
