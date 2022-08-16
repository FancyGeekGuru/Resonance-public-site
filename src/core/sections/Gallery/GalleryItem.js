import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PrismicImage } from 'core/components/PrismicImage'
import { PrismicLink } from '@prismicio/react'

const variants = {
  hidden: {
    opacity: 0,
    scale: 0.75,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
}

export const GalleryItem = ({ image, link, ...rest }) => {
  const imageComponent = useMemo(() => image && (
    <PrismicImage src={image} layout="responsive" />
  ), [image])

  return (
    <motion.div
      layout
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="
        col-span-4 md:col-span-3
      "
      {...rest}
    >
      {link?.url ? (
        <PrismicLink field={link}>{imageComponent}</PrismicLink>
      ) : imageComponent}
    </motion.div>
  )
}
