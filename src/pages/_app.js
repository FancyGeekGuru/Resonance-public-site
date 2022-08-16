import 'styles/main.css'

import { elementType, object } from 'prop-types'
import Head from 'next/head'
import seo from 'lib/config/seo'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'
import { UIProvider } from 'core/context/ui'
import { PrismicProvider } from '@prismicio/react'
import { PrismicPreview } from '@prismicio/next'
import { linkResolver, repositoryName } from 'lib/prismic/client'
import { Link } from 'core/components/Link'
import smoothscroll from 'smoothscroll-polyfill'
import { useEffect } from 'react'
import { defaultComponents } from 'core/components/Typography'

const noop = ({ children }) => children

/**
 * This component handles persistent layout, state, and global styles as you
 * navigate between pages. Global app logic should be defined here.
 *
 * @prop {elementType} Component - The active page, whenever you navigate between
 * routes, `Component` will change to the new page. Therefore, any props you
 * send to Component will be received by the page.
 *
 * @prop {object} pageProps - An object with the initial props that were
 * preloaded for your page by one of Next's data fetching methods, otherwise
 * it's an empty object.
 *
 * @prop {NextRouter} router - An instance of Router from 'next/router'
 */
export default function App({ Component, pageProps }) {
  const { pathname } = useRouter()
  const { canonical, ...seoRest } = seo
  const Layout = Component.layout || noop

  const { page, nav } = pageProps ?? {}

  useEffect(() => {
    // kick off the polyfill!
    smoothscroll.polyfill()

    // Set some css variables to better support mobile safari browsers
    const setInitial = () => {
      const viewportHeight = Math.max(document.documentElement.clientHeight, innerHeight || 0)
      const root = document.querySelector(':root')
      root.style.setProperty('--ivh', `${viewportHeight / 100}px`)
    }

    const handleResize = () => {
      const { innerWidth, innerHeight } = window
      const root = document.querySelector(':root')
      if (window && root) {
        const viewportHeight = Math.max(document.documentElement.clientHeight, innerHeight || 0)
        root.style.setProperty('--vh', `${viewportHeight / 100}px`)
        root.style.setProperty('--vw', `${innerWidth / 100}px`)
      }
    }

    setInitial()
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <Head>
        <link rel="icon" type="image/svg+xml" href="favicon.svg" />
        <link rel="icon" type="image/png" href="favicon.png" />
      </Head>
      <DefaultSeo canonical={canonical + pathname} {...seoRest} />
      <PrismicProvider
        linkResolver={linkResolver}
        internalLinkComponent={Link}
        externalLinkComponent={Link}
        richTextComponents={defaultComponents}
      >
        <PrismicPreview repositoryName={repositoryName}>
          <UIProvider>
            <Layout theme={page?.theme} nav={nav}>
              <Component {...pageProps} />
            </Layout>
          </UIProvider>
        </PrismicPreview>
      </PrismicProvider>
    </>
  )
}

App.propTypes = {
  Component: elementType.isRequired,
  pageProps: object.isRequired,
  router:  object,
}
