import { object, string } from 'prop-types'
import { Link } from 'core/components/Link'
import { Logo } from 'core/components/Icons/Logo'
import { useMatchMedia } from 'lib/hooks/useMatchMedia'
import { mediaQueries } from 'lib/utils/mediaQueries'
import { DesktopNav, MobileNav } from 'core/components/Nav'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useScrollEventListener } from 'lib/hooks/useScrollEventListener'
import { classNames } from 'lib/utils/classNames'
import { useRouter } from 'next/router'
import { pageTransitionSpeed } from 'lib/constants/styles'
import { useUI } from 'lib/hooks/useUI'

export function Header({ nav, theme }) {
  const router = useRouter()
  const resizeObserver = useRef()
  const [visible, setVisible] = useState(true)
  const scrollPosition = useRef(0)
  const headerRef = useRef()
  const isDesktop = useMatchMedia(mediaQueries.lg)
  const isMobile = !useMatchMedia(mediaQueries.md)
  const [headerTheme, setHeaderTheme] = useState(theme)
  const [{ navOpen }] = useUI()
  const Nav = isMobile ? MobileNav : DesktopNav

  const handleResize = useCallback(() => {
    if (headerRef.current) {
      const { height } = headerRef.current.getBoundingClientRect()
      document.documentElement.style.setProperty('--header-height', `${height}px`)
    }
  }, [])

  const updateTheme = useCallback(() => {
    if (headerRef.current) {
      const { height, width } = headerRef.current.getBoundingClientRect()
      const currentThemeWrapper = document
        .elementsFromPoint(width / 2, height / 2)
        .find((element) => element.classList.contains('theme-wrapper'))
      const currentTheme = currentThemeWrapper?.dataset?.theme
      if (currentTheme) setHeaderTheme(currentTheme)
    }
  }, [])

  const handleScroll = useCallback(() => {
    const { scrollTop } = document.scrollingElement
    const direction = (scrollTop - scrollPosition.current) > 0 ? 1 : -1
    if (scrollTop !== scrollPosition.current) {
      scrollPosition.current = scrollTop
      setVisible(direction < 0 || scrollTop < 10)
    }
    updateTheme()
  }, [updateTheme])

  useScrollEventListener(handleScroll)
  useEffect(() => {
    let timeout
    const handleRouteChange = () => {
      timeout = window.setTimeout(handleScroll, pageTransitionSpeed * 2)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      if (timeout) window.clearTimeout(timeout)
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events, handleScroll])

  useEffect(() => {
    resizeObserver.current = new ResizeObserver(handleResize)
    resizeObserver.current.observe(headerRef.current)
    return () => {
      resizeObserver.current.disconnect()
      setVisible(false)
    }
  }, [handleResize])

  return (
    <header
      ref={headerRef}
      className={classNames(
        'fixed top-0 left-0 w-full z-50 transition-transform duration-500 ease-ease text-foreground pointer-events-none',
        visible ? 'translate-y-0' : '-translate-y-full',
      )}
      data-theme={navOpen ? 'black' : headerTheme}
    >
      <div className="container flex justify-between py-[20px] md:py-[32px] items-center">
        <Link
          href="/"
          className="
            text-xl sm:text-2xl font-bold text-foreground
            pointer-events-auto transition-colors duration-300 z-50
          "
        >
          <Logo animate={true} height={isDesktop ? 70 : 50} />
        </Link>
        {!!nav && <Nav {...nav} />}
      </div>
    </header>
  )
}

Header.propTypes = {
  nav: object,
  theme: string,
}
