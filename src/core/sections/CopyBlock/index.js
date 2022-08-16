import React from 'react'
import { PrismicRichText } from '@prismicio/react'
import { Section } from 'core/layouts/Section'
import { classNames } from 'lib/utils/classNames'

const CopyBlock = ({ slice: { primary: { copy, centered, ...primary } }, ...rest }) => (
  <Section {...primary} {...rest}>
    <div className="container grid grid-cols-12">
      <div
        className={classNames(
          'col-span-12 md:col-span-10 md:col-start-2',
          centered && 'text-center',
        )}
      >
        <PrismicRichText field={copy} />
      </div>
    </div>
  </Section>
)

export default CopyBlock
