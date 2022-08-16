import { useCallback, useMemo, useRef } from 'react'
import { Section } from 'core/layouts/Section'
import { PrismicImage } from 'core/components/PrismicImage'
import { useScrollEventListener } from 'lib/hooks/useScrollEventListener'
import { classNames } from 'lib/utils/classNames'
import { PrismicRichText } from '@prismicio/react'
import { defaultComponents } from 'core/components/Typography'

const copyComponents = {
  ...defaultComponents,
  paragraph: (props) => <p className="type-number" {...props} />,
}

const Image = ({ slice: { primary: { image, fit = 'cover', fullWidth, parallax, copy, ...primary } }, ...rest }) => {
  const scrollRef = useRef()
  let parallaxDirection = 0
  switch (parallax) {
    case 'near':
      parallaxDirection = 1
      break
    case 'far':
      parallaxDirection = -1
      break
    default:
      break
  }

  const Image = useMemo(() => (
    <div className="absolute w-full h-full">
      <PrismicImage
        src={image}
        objectFit={fit}
        objectPosition="center"
        layout="fill"
      />
    </div>
  ), [fit, image])

  const parallaxFrame = useCallback(({ scrollProgress }) => {
    if (scrollRef.current) {
      const translateAmount = parallaxDirection * (scrollProgress - 0.5) * 10
      scrollRef.current.style.transform = `translateY(${translateAmount}%)`
    }
  }, [parallaxDirection])

  useScrollEventListener(parallaxFrame, !parallax || parallax !== 'none', scrollRef)
  return (
    <Section
      ref={scrollRef}
      className={classNames('relative my-20 sm:my-0', !fullWidth && 'container')}
      {...primary}
      {...rest}
    >
      <div className="relative w-full h-[30em] md:h-[36em] flex flex-col justify-center">
        {Image}
        {!!copy && (
          <div className={classNames('relative z-10', fullWidth && 'container')}>
            <div className="max-w-3xl text-foreground">
              <PrismicRichText field={copy} components={copyComponents} />
            </div>
          </div>
        )}
      </div>
    </Section>
  )
}

export default Image
