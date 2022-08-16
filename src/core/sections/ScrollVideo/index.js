import React from 'react'
import { Section } from 'core/layouts/Section'
import { PrismicRichText } from '@prismicio/react'
import { ScrollVideo } from './ScrollVideo'

const ScrollVideoSection = ({
  slice: {
    primary: { heading, mobileVideo, desktopVideo, seekSpeed, ...primary },
    items,
  },
  ...rest
}) => (
  <Section {...primary} {...rest}>
    {heading && (
      <div className="container grid grid-cols-12 mb-32">
        <div className="col-span-12 md:col-span-10 md:col-start-2 text-center">
          <PrismicRichText field={heading} />
        </div>
      </div>
    )}
    <ScrollVideo {...{ heading, mobileVideo, desktopVideo, seekSpeed }} items={items} />
  </Section>
)

export default ScrollVideoSection
