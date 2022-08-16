/* istanbul ignore file */
import { useEffect, useState } from 'react'
import { node } from 'prop-types'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'
import { pageTransitionSpeed } from 'lib/constants/styles'

/**
 * PageTransition component for Next.js built with framer-motion. Children
 * wrapped in the component fade out when router events are fired. Designed to
 * be used as high-level as possible, preferably in 'pages/_app'.
 */
export function PageTransition({ children }) {
  const router = useRouter()
  const [isChanged, setIsChanged] = useState(true)

  useEffect(() => {
    let timeout = null

    const handleRouteStart = () => {
      setIsChanged(false)
    }

    const handleRouteComplete = () => {
      timeout = window.setTimeout(() => {
        setIsChanged(true)
        document.scrollingElement.scrollTo({ top: 0 })
      }, pageTransitionSpeed)
    }

    router.events.on('routeChangeStart', handleRouteStart)
    router.events.on('routeChangeComplete', handleRouteComplete)

    return () => {
      if (timeout) clearTimeout(timeout)
      router.events.off('routeChangeStart', handleRouteStart)
      router.events.off('routeChangeComplete', handleRouteComplete)
    }
  }, [router.events])

  return (
    <AnimatePresence>
      {isChanged && (
        <motion.div
          transition={{ duration: pageTransitionSpeed / 1000 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

PageTransition.propTypes = {
  children: node,
}
