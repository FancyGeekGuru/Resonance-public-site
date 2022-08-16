import { node, object, string } from 'prop-types'
import { Header } from 'core/components/Header'
import { PageTransition } from 'core/components/PageTransition'
import { Footer } from 'core/components/Footer'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { pageTransitionSpeed } from 'lib/constants/styles'

export function DefaultLayout({ children, nav, theme }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (route, timeout = true) => {
      window.setTimeout(() => {
        const pathTokens = route.split('#')
        const anchor = pathTokens.length > 1 ? pathTokens.pop() : false
        if (anchor?.length > 0) {
          const anchorSection = document.querySelector(`#${anchor}`)
          if (anchorSection) anchorSection.scrollIntoView()
        }
      }, timeout ? pageTransitionSpeed * 2 : 0)
    }

    handleRouteChange(router.asPath, false)

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  return (
    <>
      <Header nav={nav} theme={theme} />
      <main className="min-h-screen">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer nav={nav} />
    </>
  )
}

DefaultLayout.propTypes = {
  children: node,
  nav: object,
  theme: string,
}
