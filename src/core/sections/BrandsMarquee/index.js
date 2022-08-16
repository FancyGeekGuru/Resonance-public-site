import React from 'react'
import { Section } from 'core/layouts/Section'
import { ScrollMarquee } from './ScrollMarquee'

const BrandsMarquee = ({ slice, ...rest }) => (
  <Section {...slice.primary} {...rest}>
    <ScrollMarquee {...slice} />
  </Section>
)

export default BrandsMarquee
