import React from 'react'
import { classNames } from 'lib/utils/classNames'
import styles from './Tag.styles'

export const Tag = ({ children, className, onClick, isActive, ...props }) => {
  const inputID = `gallery-tag--${children}`
  return (
    <label
      {...props}
      className={classNames(
        className,
        `
          type-filters tag z-10 transition-colors duration-300 ease-ease py-0
          after:transition-colors after:duration-300 after:ease-ease cursor-pointer
        `,
        isActive ? 'text-white after:bg-accent' : 'text-accent after:bg-transparent hover:underline',
      )}
      htmlFor={inputID}
    >
      <input id={inputID} type="checkbox" className="opacity-0 absolute" onChange={onClick} value={isActive} />
      {children}
      <style jsx>{styles}</style>
    </label>
  )
}
