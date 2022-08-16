import React, { useCallback, useMemo, useRef, useState } from 'react'
import { PrismicLink, PrismicRichText } from '@prismicio/react'
import { Section } from 'core/layouts/Section'
import { classNames } from 'lib/utils/classNames'
import { useScrollEventListener } from 'lib/hooks/useScrollEventListener'
import { SpringValue } from '@react-spring/core'
import { useAnimationFrame } from 'lib/hooks/useAnimationFrame'
import { useRefs } from 'lib/hooks/useRefs'
import { useEventListener } from 'lib/hooks/useEventListener'

const ReorderCta = ({
  slice: {
    primary: {
      heading,
      copy,
      ctaLabel,
      ctaLink,
      ...primary
    },
    items,
  },
  ...rest
}) => {
  const scrollRef = useRef()
  const [flipped, setFlipped] = useState(false)
  const [animating, setAnimating] = useState(false)
  const flippedSpring = useMemo(() => new SpringValue(0, { config: { tension: 120 } }), [])
  const targetRefs = useRefs(items)
  const itemRefs = useRefs(items)

  const animate = useCallback(() => {
    const flippedVal = flippedSpring.get()
    for (const [itemIndex, item] of items.entries()) {
      const target = targetRefs[item.finalOrder - 1].current
      const itemElement = targetRefs[itemIndex].current
      const { width, left } = itemElement.getBoundingClientRect()
      const dx = target.getBoundingClientRect().left - left
      itemRefs[itemIndex].current.style.transform = `translate(${dx * flippedVal - width / 2}px, -50%)`
    }
    if (flippedSpring.idle) setAnimating(false)
  }, [flippedSpring, itemRefs, items, targetRefs])


  const onScroll = useCallback(({ scrollProgress }) => {
    const current = scrollProgress > 0.4 ? 1 : 0
    if (flippedSpring.goal !== current) {
      flippedSpring.start(current)
      setFlipped(!!current)
      setAnimating(true)
    }
  }, [flippedSpring])

  useScrollEventListener(onScroll, true, scrollRef)
  useAnimationFrame(animate, animating)
  useEventListener('resize', animate)

  return (
    <Section ref={scrollRef} {...primary} {...rest} theme="black">
      <div className="container">
        <div className="relative py-32">
          <div className="flex flex-col items-center text-center">
            <div className="max-w-3xl">
              {!!heading && <PrismicRichText field={heading} />}
            </div>
            <div className="w-full flex justify-center gap-x-1 md:gap-x-gutter mt-16">
              {items.map((item, itemIndex) => {
                const indexString = itemIndex + 1 > 10 ? itemIndex + 1 : `0${itemIndex + 1}`
                return (
                  <div key={`${item.label}--${itemIndex}`} className="max-w-[30%]">
                    <div className="text-left type-number">{indexString}</div>
                    <div
                      ref={targetRefs[itemIndex]}
                      className="relative max-h-[226px] max-w-[100%] w-[30vw] pt-[46%] -mt-1"
                    >
                      <div
                        ref={itemRefs[itemIndex]}
                        className={classNames(
                          'absolute-center rounded-full w-full h-full',
                          'type-h2 text-white transition-colors duration-500 border-2 border-black',
                          flipped ? 'bg-aquamarine' : 'bg-gray',
                        )}
                      >
                        <span className="absolute-center">{item.label}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="max-w-3xl mt-16">
              {!!copy && <PrismicRichText field={copy} />}
            </div>
            <PrismicLink field={ctaLink} className="btn btn-yellow mt-14">{ctaLabel}</PrismicLink>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default ReorderCta
