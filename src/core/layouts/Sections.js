import { bool, object } from 'prop-types'
import { SliceZone } from '@prismicio/react'
import { components } from 'core/sections'
import { ThemeWrapper } from 'core/layouts/ThemeWrapper'

export const Sections = ({ page, padFirstSection, ...rest }) => (
  <ThemeWrapper defaultTheme={page.theme}>
    <SliceZone
      context={{ padFirstSection }}
      slices={page.slices}
      components={components}
      {...rest}
    />
  </ThemeWrapper>
)

Sections.propTypes = {
  page: object,
  padFirstSection: bool,
}
