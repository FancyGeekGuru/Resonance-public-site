import { getBlurDataURL } from 'lib/utils/getBlurDataURL'
import { shape, string } from 'prop-types'
import NextImage from 'next/image'
import { asImageSrc } from '@prismicio/helpers'
import { useMatchMedia } from 'lib/hooks/useMatchMedia'
import { mediaQueries } from 'lib/utils/mediaQueries'

export const PrismicImage = ({ src, layout, ...rest }) => {
  const isNotMobile = useMatchMedia(mediaQueries.sm)
  const mobileSrc = src.mobile ?? src
  const currentSrc = isNotMobile ? src : mobileSrc
  const dimensions = layout !== 'fill' ? currentSrc.dimensions : {}

  return isNotMobile !== null && (
    <NextImage
      src={asImageSrc(currentSrc)}
      alt={src.alt}
      layout={layout}
      placeholder="blur"
      blurDataURL={getBlurDataURL(currentSrc)}
      {...dimensions}
      {...rest}
    />
  )
}

PrismicImage.propTypes = {
  src: shape({
    url: string,
    alt: string,
  }),
  layout: string,
}
