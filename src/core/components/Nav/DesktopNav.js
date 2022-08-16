import { PrismicLink } from '@prismicio/react'
import { AnimatePresence, motion } from 'framer-motion'
import { classNames } from 'lib/utils/classNames'
import { useRouter } from 'next/router'
import { NavProps } from './types'

/**
 * Header navigation.
 */
export function DesktopNav({ primaryNav }) {
  const { asPath: currentPath } = useRouter()
  return (
    <nav className="flex mx-[-6px] flex-row pointer-events-auto" role="navigation">
      <AnimatePresence>
        {primaryNav.map(({ label, link, anchor }) => {
          const isActiveRoute = `/${link.slug}` === currentPath
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={label}
              className="px-[6px]"
            >
              <PrismicLink
                field={link}
                anchor={anchor}
                className={classNames(
                  'pointer-events-all px-8 py-4 rounded-full type-nav',
                  'transition-colors duration-200',
                  isActiveRoute
                    ? 'text-background bg-foreground'
                    : 'hover:text-background bg-transparent hover:bg-foreground',
                )}
              >
                {label}
              </PrismicLink>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </nav>
  )
}

DesktopNav.propTypes = NavProps
