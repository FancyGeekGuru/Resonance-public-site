import { bool, string } from 'prop-types'
import NextLink from 'next/link'
import { useUIDispatch } from 'lib/hooks/useUI'

/**
 * A wrapper for 'next/link'.
 * @param {string} href - URL to link. If external, Link won't render with `next/link` wrapper.
 * @param {boolean} newTab - Force link to open in a new tab
 * @param {string} anchor - Anchor link to append to url
 */
export function Link({ href, newTab, anchor, ...rest }) {
  const { closeMobileNav } = useUIDispatch()
  if (!href) throw new Error('Require1d `href` prop not supplied to Link component')
  const external = {}

  if (newTab) {
    external.target = '_blank'
    external.rel = 'noopener noreferrer'
  }

  // If href is external, render a normal anchor tag.
  if (href.startsWith('http')) {
    return <a href={href} {...external} {...rest} />
  }

  const pageHref = href === '/home' ? '/' : href
  const pageAnchor = anchor ? `#${anchor}` : ''

  return (
    <NextLink href={`${pageHref}${pageAnchor}`}>
      <a {...rest} {...external} onClick={closeMobileNav} />
    </NextLink>
  )
}

Link.propTypes = {
  href: string,
  newTab: bool,
  anchor: string,
}
