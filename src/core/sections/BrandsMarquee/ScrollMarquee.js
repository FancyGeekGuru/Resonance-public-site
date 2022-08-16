import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PrismicRichText } from '@prismicio/react'
import { withScroll } from 'lib/utils/withScroll'
import { useScroll } from 'lib/hooks/useScroll'
import { PrismicImage } from 'core/components/PrismicImage'
import { useEventListener } from 'lib/hooks/useEventListener'

export const ScrollMarquee = withScroll(({ primary: { heading }, items }) => {
  const fixedElementRef = useRef()
  const containerRef = useRef()
  const sliderRef = useRef()
  const [containerWidth, setContainerWidth] = useState(0)
  const { controller: scroll, onUpdateRef } = useScroll()

  const onScroll = useCallback(() => {
    if (sliderRef.current) {
      const { width: containerWidth } = containerRef.current.getBoundingClientRect()
      const { width: sliderWidth } = sliderRef.current.getBoundingClientRect()
      const { progress } = scroll.get()
      const offsetX = progress * (sliderWidth - containerWidth)
      sliderRef.current.style.transform = `translateX(${-offsetX}px)`
    }
  }, [scroll])

  const handleResize = useCallback(() => {
    const { width: containerWidth } = containerRef.current.getBoundingClientRect()
    setContainerWidth(containerWidth)
  }, [])

  useEffect(() => {
    if (onUpdateRef) onUpdateRef.current = onScroll
  }, [onScroll, onUpdateRef])

  useEventListener('resize', handleResize, { initial: true })

  return (
    <div
      className="relative"
      style={{ height: `${items.length * 100}vh` }}
    >
      <div
        ref={fixedElementRef}
        className="
          sticky top-header-height left-0
          h-header-safe w-full overflow-hidden py-4
        "
      >
        <div className="container h-full flex flex-col items-center">
          <div className="text-center mb-16">
            <PrismicRichText field={heading} />
          </div>
          <div ref={containerRef} className="relative w-full h-full flex-grow">
            <div
              id="slider"
              ref={sliderRef}
              className="absolute top-0 left-0 flex flex-nowrap flex-shrink-0 h-full w-auto space-x-margin"
            >
              {items.map(({ image, copy }, itemIndex) => (
                <div
                  key={`item--${itemIndex}`}
                  className="
                    relative md:h-full
                    grid grid-cols-12 grid-rows-6 gap-x-gutter
                  "
                  style={{ width: `${containerWidth}px` }}
                >
                  <div
                    className="
                      relative
                      row-span-2 sm:row-span-6 md:row-span-5
                      col-start-2 sm:col-start-1 md:col-start-1 lg:col-start-2
                      col-span-12 sm:col-span-5 md:col-span-4 lg:col-span-3
                    "
                  >
                    <PrismicImage
                      src={image}
                      layout="fill"
                      objectFit="contain"
                      objectPosition="left center"
                    />
                  </div>
                  <div
                    className="
                      row-span-4 sm:row-span-6 md:row-span-5
                      col-start-2 sm:col-start-7 md:col-start-6 lg:col-start-6
                      col-span-10 sm:col-span-6 md:col-span-8 lg:col-span-6
                      pt-8 sm:pt-0 flex flex-col sm:justify-center
                    "
                  >
                    <PrismicRichText field={copy} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
