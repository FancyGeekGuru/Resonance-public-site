import React from 'react'
import { Section } from 'core/layouts/Section'
import { TriCycle } from './TriCycle'

const TriCycleSection = ({ slice, ...rest }) => {
  slice.primary.theme = 'black'
  return (
    <Section {...slice.primary} id={slice?.primary?.anchor} {...rest}>
      <TriCycle {...slice} />
    </Section>
  )
}

// script to fetch breakout pages from CMS on-build
TriCycleSection.fetchSliceData = async (client, slice) => {
  for (const [itemIndex, item] of slice.items.entries()) {
    if (item.breakoutPage.id) {
      // eslint-disable-next-line no-await-in-loop
      const page = await client.getByID(item.breakoutPage.id)
      const pageData = page?.data ?? null
      pageData.theme = pageData.slices[0]?.primary.theme
      slice.items[itemIndex].breakoutPage = pageData
    }
  }
}

export default TriCycleSection
