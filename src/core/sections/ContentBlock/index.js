import React, { useMemo } from 'react'
import { PrismicRichText } from '@prismicio/react'
import { Section } from 'core/layouts/Section'
import { defaultComponents } from 'core/components/Typography'
import { Mark } from 'core/components/Icons/Mark'
import { PrismicImage } from 'core/components/PrismicImage'
import { classNames } from 'lib/utils/classNames'

const captionComponents = {
  ...defaultComponents,
  paragraph: (props) => (
    <p
      className="text-center type-body-small first-of-type:pt-12 max-w-lg"
      {...props}
    />
  ),
}

const ContentBlock = ({
  slice: {
    primary: {
      copy,
      headingLogo,
      flip,
      image,
      imageCaption,
      ...primary
    },
  },
  ...rest
}) => {
  const copyComponents = useMemo(() => ({
    ...defaultComponents,
    heading1: ({ children, ...rest }) => (
      <h1 className="type-h1" {...rest}>
        {headingLogo && (
          <Mark className="h-[0.85em] inline -translate-y-[15%] mr-2" />
        )}
        {children}
      </h1>
    ),
    heading2: (props) => <h2 className="type-h2" {...props} />,
    heading3: (props) => <h3 className="type-h3" {...props} />,
    paragraph: (props) => (
      <p
        className="type-body max-w-3xl first-of-type:pt-9"
        {...props}
      />
    ),
  }), [headingLogo])

  return (
    <Section {...primary} className="bg-background text-foreground" {...rest}>
      <div className="container grid grid-cols-12 gap-x-gutter gap-y-8">
        <div
          className={classNames(
            'col-span-12 md:col-span-5 lg:col-span-4 flex flex-col justify-center h-full md:row-start-1',
            flip ? 'md:col-start-8' : 'lg:col-start-2',
          )}
        >
          <PrismicRichText field={copy} components={copyComponents} />
        </div>
        <div
          className={classNames(
            'col-span-12 md:col-span-6 flex flex-col items-center md:row-start-1',
            !flip && 'md:col-start-7',
          )}
        >
          <div className="relative w-full h-screen-1/3 md:h-96">
            <PrismicImage src={image} layout="fill" objectFit="contain" objectPosition="center" />
          </div>
          <PrismicRichText field={imageCaption} components={captionComponents} />
        </div>
      </div>
    </Section>
  )}

export default ContentBlock
