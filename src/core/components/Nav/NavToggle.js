import { useEffect } from 'react'
import { useUI } from 'lib/hooks/useUI'
import { classNames } from 'lib/utils/classNames'
import styles from './NavToggle.styles'

/**
 * Mobile tav toggle. Conditionally rendered depending on breakpoint.
 */
export function NavToggle() {
  const [{ navOpen }, { openMobileNav, closeMobileNav }] = useUI()

  const handleToggle = navOpen ? closeMobileNav : openMobileNav

  // close mobile nav if window is resized to desktop breakpoint
  useEffect(() => closeMobileNav, [closeMobileNav])

  return (
    <button
      id="nav-menu-button"
      className={classNames('nav-toggle z-50 pointer-events-auto', navOpen && 'is-open')}
      onClick={handleToggle}
      aria-label="mobile nav toggle"
      aria-haspopup="true"
      aria-controls="nav-menu"
    >
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect y="12" width="50" height="5.31875" rx="2.65937" fill="currentColor" />
        <rect y="22.3403" width="50" height="5.31875" rx="2.65937" fill="currentColor" />
        <rect y="32.6812" width="50" height="5.31875" rx="2.65937" fill="currentColor" />
      </svg>
      <style jsx>{styles}</style>
    </button>
  )
}
