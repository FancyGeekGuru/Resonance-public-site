import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PrismicRichText } from '@prismicio/react'
import { Section } from 'core/layouts/Section'
import { AnimatePresence, motion } from 'framer-motion'
import { Tag } from './Tag'
import { tokenizeItemsTags, tokenizeTagString } from './utils'
import { GalleryItem } from './GalleryItem'

const ALL_TAG = 'all'

const Gallery = ({ slice: { primary: { heading, ...primary }, items }, ...rest }) => {
  const tags = useMemo(() => tokenizeItemsTags(items), [items])

  const [activeTags, setActiveTags] = useState([ALL_TAG])
  const filterTimeoutRef = useRef()
  const allTagsActive = activeTags[0] === ALL_TAG

  const handleFilter = useCallback((tag) => {
    if (tag === ALL_TAG) setActiveTags(['all'])
    else setActiveTags((prevTags) => {
      const filteredPrevTags = prevTags.filter((tag) => tag !== ALL_TAG)
      if (filteredPrevTags.includes(tag)) {
        filteredPrevTags.splice(filteredPrevTags.indexOf(tag), 1)
        if (filteredPrevTags.length === 0) filteredPrevTags.push(ALL_TAG)
        return filteredPrevTags
      }
      else return [...filteredPrevTags, tag]
    })
  }, [])

  // this triggers a re-render slightly after tags are updated
  // to fix a bug in AnimateSharedLayout where elements get stuck in the wrong place
  const [, rerender] = useState(false)
  useEffect(() => {
    if (filterTimeoutRef.current) window.clearTimeout(filterTimeoutRef.current)
    filterTimeoutRef.current = window.setTimeout(() => rerender((old) => !old), 100)
    return () => window.clearTimeout(filterTimeoutRef.current)
  }, [activeTags])

  return (
    <Section {...primary} {...rest}>
      <div className="container flex flex-col items-center">
        <div className="text-center max-w-7xl">
          <PrismicRichText field={heading} />
        </div>
        <div className="type-filters w-full flex justify-center gap-x-[2em] gap-y-[1.35em] px-7 my-8 flex-wrap">
          <Tag onClick={() => handleFilter(ALL_TAG)} isActive={allTagsActive}>
            {ALL_TAG}
          </Tag>
          {tags.map((tag) => (
            <Tag
              key={tag}
              onClick={() => handleFilter(tag)}
              isActive={!allTagsActive && activeTags.includes(tag)}
            >
              {tag}
            </Tag>
          ))}
        </div>
        <AnimatePresence>
          <motion.div layout className="w-full grid grid-cols-12 gap-gutter mt-10">
            {items.map(({ tags: itemTags, ...item }, itemIndex) => {
              const shown = allTagsActive
                || tokenizeTagString(itemTags).some((tag) => activeTags.includes(tag))
              return shown && <GalleryItem {...item} key={`item--${itemIndex}`} />
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  )
}

export default Gallery
