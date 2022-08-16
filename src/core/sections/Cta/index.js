import React from 'react'
import { PrismicLink, PrismicRichText } from '@prismicio/react'
import { Section } from 'core/layouts/Section'

const Cta = ({
  slice: {
    primary: {
      copy,
      ctaLabel,
      ctaLink,
      ...primary
    },
  },
  ...rest
}) => (
  <Section {...primary} {...rest}>
    <div className="container flex flex-col items-center">
      <div className="text-center max-w-4xl">
        <PrismicRichText field={copy} />
      </div>
      {ctaLink && ctaLabel && (
        <PrismicLink field={ctaLink} className="btn btn-yellow mt-16">
          {ctaLabel}
        </PrismicLink>
      )}
    </div>
  </Section>
)

export default Cta
