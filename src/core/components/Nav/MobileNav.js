import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'
import { PrismicLink } from '@prismicio/react'
import { useUI } from 'lib/hooks/useUI'
import { useBodyLock } from 'lib/hooks/useBodyLock'
import { Social } from 'core/components/Icons/Social'
import { NavToggle } from './NavToggle'
import { NavProps } from './types'

// motion variants for the list
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

// motion variants for the list items
const itemVariants = {
  hidden: {
    opacity: 0,
    y: '10%',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  show: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

/**
 * Mobile Nav elements.
 */
export function MobileNav({ primaryNav, secondaryNav, socialLinks }) {
  const router = useRouter()
  const [{ navOpen }, { closeMobileNav }] = useUI()
  useBodyLock(navOpen)

  useEffect(() => {
    router.events.on('routeChangeComplete', closeMobileNav)
    return () => router.events.off('routeChangeComplete', closeMobileNav)
  }, [closeMobileNav, router])

  return (
    <>
      <NavToggle />
      <AnimatePresence>
        {navOpen && (
          <motion.nav
            id="nav-menu"
            className="
              fixed top-0 left-0 z-40
              container w-full h-screen-responsive pt-header-height pb-6 bg-background
              flex flex-col justify-between
              select-none overflow-x-hidden overflow-y-scroll pointer-events-auto
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="space-y-10 pt-24"
              variants={listVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              {primaryNav.map(({ label, link, anchor }) => (
                <motion.div variants={itemVariants} key={label}>
                  <PrismicLink field={link} anchor={anchor} className="type-nav">
                    {label}
                  </PrismicLink>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="space-y-3 flex flex-col"
              variants={itemVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              {secondaryNav.map(({ label, link, anchor }) => (
                <PrismicLink
                  key={label}
                  anchor={anchor}
                  field={link}
                  className="type-footer"
                >
                  {label}
                </PrismicLink>
              ))}
              <div className="flex space-x-3">
                {socialLinks.map(({ type, link }) => (
                  <PrismicLink key={type} field={link} className="w-6 h-6">
                    <Social type={type} className="h-full" />
                  </PrismicLink>
                ))}
              </div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}

MobileNav.propTypes = NavProps
