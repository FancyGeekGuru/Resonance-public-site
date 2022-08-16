import React from 'react'
import { motion } from 'framer-motion'
import { Mark } from 'core/components/Icons/Mark'
import { classNames } from 'lib/utils/classNames'
import { bool, node, number, string } from 'prop-types'

const variants = (delay, inner) => ({
  hidden: {
    opacity: 0,
    x: inner ? '120%' : '-100%',
    y: inner ? 0 : '-50%',
    transition: { duration: 0.5 },
  },
  visible: {
    opacity: 1,
    x: '0',
    y: inner ? 0 : '-50%',
    transition: {
      duration: 0.5,
      delay,
    },
  },
})

const colorClasses = {
  yellow: 'bg-yellow',
  aquamarine: 'bg-aquamarine',
  pink: 'bg-pink',
}

export const WordPill = ({
  children,
  showMark = true,
  color = 'yellow',
  delay = 0,
  className,
  ...rest
}) => (
  <span
    className={classNames(
      'relative inline-block overflow-hidden rounded-full',
      'mx-1 -mb-[0.3em] pl-[0.25em] py-[0.1em]',
      showMark ? 'pr-[0.9em]' : 'pr-[0.25em]',
      className,
    )}
    {...rest}
  >
    <span className="relative opacity-0 pointer-events-none not-sr-only w-full h-full">
      {children}
    </span>
    <motion.span
      initial="hidden"
      animate="visible"
      variants={variants(delay, false)}
      className={classNames(
        'absolute top-1/2 left-0 h-full pl-[0.25em] py-[0.1em] z-10',
        showMark ? 'pr-[0.825em]' : 'pr-[0.25em]',
        'rounded-full overflow-hidden text-black w-full',
        colorClasses[color] ?? colorClasses.yellow,
      )}
    >
      <motion.span
        initial="hidden"
        animate="visible"
        variants={variants(delay, true)}
        className="relative w-full h-full inline-flex justify-center items-center"
      >
        {children}
        {showMark && (
          <Mark
            className="
              absolute top-[0.1em] right-0 translate-x-[calc(100%+0.125em)]
              text-black h-[0.35em] z-10
            "
          />
        )}
      </motion.span>
    </motion.span>
  </span>
)

WordPill.propTypes = {
  children: node,
  showMark: bool,
  color: string,
  delay: number,
  className: string,
}
