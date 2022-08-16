import { asImageSrc } from '@prismicio/helpers'

export const getBlurDataURL = (prismicImageField) => asImageSrc(
  prismicImageField,
  { blur: 50, dpr: 0.1, ...prismicImageField.dimensions },
)
