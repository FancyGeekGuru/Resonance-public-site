import { forwardRef } from 'react'
import { classNames } from 'lib/utils/classNames'
import { node, number, object, oneOf, string } from 'prop-types'
import { colors, themes } from '../../../tailwind/theme'

const themeNames = Object.keys(themes)

const spacingTop = {
  sm: 'pt-2 md:pt-4',
  md: 'pt-4 md:pt-8',
  lg: 'pt-8 md:pt-16',
  xl: 'pt-16 md:pt-32',
  '2xl': 'pt-32 md:pt-52',
  '3xl': 'pt-52 md:pt-72',
  '4xl': 'pt-72 md:pt-96',
}

const spacingBottom = {
  sm: 'pb-2 md:pb-4',
  md: 'pb-4 md:pb-8',
  lg: 'pb-8 md:pb-16',
  xl: 'pb-16 md:pb-32',
  '2xl': 'pb-32 md:pb-52',
  '3xl': 'pb-52 md:pb-72',
  '4xl': 'pb-72 md:pb-96',
}

export const Section = forwardRef(({
  theme: themeKey,
  accent,
  paddingTop,
  paddingBottom,
  className,
  context: { padFirstSection = true },
  children,
  index,
  style = {},
  id,
}, ref) => {
  const theme = themeNames.includes(themeKey) ? themeKey : 'white'
  const paddingTopClass = spacingTop[paddingTop]
  const paddingBottomClass = spacingBottom[paddingBottom]

  style['--accent'] = colors[accent]
  const firstSectionPadding = 'pt-header-height'

  return (
    <section
      data-theme={theme}
      data-accent={accent}
      data-section-index={index}
      ref={ref}
      className={classNames(
        index === 0 && padFirstSection && firstSectionPadding,
        className,
      )}
      style={style}
      id={id}
    >
      <div className={classNames(paddingTopClass, paddingBottomClass)}>
        {children}
      </div>
    </section>
  )
})

Section.displayName = Section

Section.propTypes = {
  theme: oneOf(themeNames),
  accent: oneOf(themeNames),
  paddingTop: string,
  paddingBottom: string,
  className: string,
  context: object,
  children: node,
  index: number,
  style: object,
  id: string,
}

