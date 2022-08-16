import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { PrismicRichText } from '@prismicio/react'
import { useRefs } from 'lib/hooks/useRefs'
import { asText } from '@prismicio/helpers'
import { hexHeightToWidthRatio } from 'core/sections/Hexagons/constants'
import { getScrollProgress } from 'lib/utils/getScrollProgress'
import { interpolate, range, sinRange } from 'lib/utils/range'
import { withScroll } from 'lib/utils/withScroll'
import { useScroll } from 'lib/hooks/useScroll'
import { clamp } from 'lib/utils/clamp'
import { SpringValue } from '@react-spring/core'
import { Sections } from 'core/layouts/Sections'
import { AnimatedHeading, defaultComponents } from 'core/components/Typography'
import { Hexagon } from './Hexagon'
import {
  hexagonPoints,
  orbitRatio,
  scaleDuration,
  sectionSpacing,
  startAngle,
  stepAngle,
} from './constants'

const circleCenterComponents = {
  ...defaultComponents,
  heading3: ({ children }) => (
    <AnimatedHeading>
      <h3 className="type-circle-heading min-h-[1em] mb-2 md:mb-5">{children}</h3>
    </AnimatedHeading>
  ),
}

export const TriCycle = withScroll(({ primary: { circleCenterCopy }, items }) => {
  const containerRef = useRef()
  const circleRef = useRef()
  const scrollRef = useRef()
  const hexRefs = useRefs(items)
  const sectionRefs = useRefs(items)
  const hexDims = useRef({ width: 0, height: 0, maxScale: 1 })
  const rotationSpring = useMemo(() => new SpringValue(0, { config: { tension: 150 } }), [])

  const onScroll = useCallback(() => {
    if (containerRef.current?.parentElement) {
      // Update container position
      const {
        top: sectionTop,
        bottom: sectionBottom,
      } = containerRef.current.parentElement.getBoundingClientRect()
      const containerOffset = clamp(0, sectionTop, sectionBottom - window.innerHeight)
      containerRef.current.style.transform = `translateY(${containerOffset}px)`
    }

    if (!circleRef.current || !hexDims.current) return

    // precompute some things, define variables
    let rotationPercent = 0
    const height = window.innerHeight
    const positions = Array.from({ ...sectionRefs })

    const { width: diameter } = circleRef.current.getBoundingClientRect()
    const { width: hexWidth, height: hexHeight, maxScale } = hexDims.current
    const r = orbitRatio * diameter / 2 // radius
    const qScreenHeight = window.innerHeight / 4
    const spacerHeight = window.innerHeight * sectionSpacing
    const scaleHeight = spacerHeight * scaleDuration

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const section = sectionRefs[itemIndex].current

      // update global rotation
      if (section) {
        const { position } = getScrollProgress(section, false, false)
        const currentPosition = position + height

        const orbit = range(currentPosition, 0, height * (sectionSpacing - (scaleDuration * 0.5)))

        rotationPercent += orbit
        positions[itemIndex] = currentPosition
      }
    }
    rotationSpring.start(rotationPercent)

    // update each hexagon
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const hex = hexRefs[itemIndex].current
      const section = sectionRefs[itemIndex].current
      if (hex && section) {
        const { top: sectionY, height: sectionHeight } = section.getBoundingClientRect()
        const position = positions[itemIndex]

        // compute interpolated animation values
        const yIn = sinRange(position, spacerHeight - scaleHeight / 4, scaleHeight, true)
        const scaleIn = sinRange(position, spacerHeight - scaleHeight / 4, scaleHeight)
        const opacityIn = sinRange(position, spacerHeight - scaleHeight / 2, scaleHeight / 2)

        const yOut = sinRange(position, sectionHeight - spacerHeight / 2, scaleHeight, true)
        const scaleOut = sinRange(position, sectionHeight - spacerHeight / 2, scaleHeight)
        const opacityOut = sinRange(
          position,
          sectionHeight - spacerHeight / 2 + 3 * scaleHeight / 4,
          scaleHeight / 4,
        )

        // compute angle for current hexagon
        const hexAngle = startAngle + rotationSpring.get() * stepAngle

        // compute scale for current hexagon
        const scalePercent = scaleIn - scaleOut
        const scale = interpolate(scalePercent, 1, maxScale)

        // compute opacity for current hexagon
        const opacityPercent = opacityIn - opacityOut
        const opacity = 1 - opacityPercent

        // compute x and y offsets for current hexagon
        const yOffset = yIn * qScreenHeight - yOut * qScreenHeight
        const ia = Math.PI * 2 * (-itemIndex / items.length) // item angle
        const x = r * Math.cos(ia + hexAngle)
        const y = r * Math.sin(ia + hexAngle)

        // apply transformations to hexagon
        hex.style.transform = `
          translate(calc(${x}px - 50%), calc(${y + yOffset}px - 50%))
          scale(${scale})
        `
        // update hexagon z-index to make sure it appears over rest of circle
        hex.style.zIndex = 1 + Math.round(scale) * 20
        // disable pointer events if already looking at the corresponding section
        hex.childNodes[0].style.pointerEvents = scale > 1 ? 'none' : 'all'

        const hexWord = hex.querySelector('.hex-word')
        if (hexWord) hexWord.style.opacity = opacity

        // udpate corresponding section content clip path to match current hexagon
        if (scalePercent < 1) {
          const { left: hexX, top: hexTop } = hex.getBoundingClientRect()
          const hexY = hexTop - sectionY
          const scaledWidth = hexWidth * scale
          const scaledHeight = hexHeight * scale
          const points = hexagonPoints.reduce((acc, [x, y]) => {
            const px = (x * scaledWidth) + hexX
            const py = (y * scaledHeight) + hexY
            const point = `${px}px ${py}px`
            return acc.length > 0 ? `${acc}, ${point}` : point
          }, '')
          section.style.clipPath = `polygon(${points})`
        }
        else {
          section.style.clipPath = null
        }
      }
    }
  }, [sectionRefs, rotationSpring, hexRefs, items.length])

  const handleResize = useCallback(() => {
    const vMin = Math.min(window.innerWidth, window.innerHeight)
    const hexHeight = vMin * 0.225
    const hexWidth = hexHeight / hexHeightToWidthRatio
    const maxScale = window.innerWidth > window.innerHeight
      ? 2 * window.innerWidth / hexWidth
      : 3 * window.innerHeight / hexHeight
    hexDims.current = { height: hexHeight, width: hexWidth, maxScale }
    // compute, store, and apply sizes of hexagons on resize
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const hex = hexRefs[itemIndex].current
      if (hex) {
        hex.style.width = `${hexWidth}px`
        hex.style.height = `${hexHeight}px`
        hex.style.fontSize = `${hexHeight / 4}px`
      }
    }
    onScroll()
  }, [hexRefs, items.length, onScroll])

  // handle clicking a hexagon to skip to that section
  const skipTo = useCallback((targetIndex) => {
    const { top: sectionTop } = sectionRefs[targetIndex].current.getBoundingClientRect()
    const offset = scaleDuration * window.innerHeight * 1 / 3
    // jump to position just before section is shown
    document.scrollingElement.scrollBy({ top: sectionTop + offset })
    // smoothly scroll into section
    window.setTimeout(
      () => document.scrollingElement.scrollBy({
        top: window.innerHeight * scaleDuration * 1.5,
        behavior: 'smooth',
      }),
      350,
    )
  }, [sectionRefs])

  // use spring powered scroll events
  useScroll(onScroll)

  // update elements on-mount
  useEffect(() => {
    if (scrollRef.current) {
      const resizeObserver = new ResizeObserver(handleResize)
      resizeObserver.observe(scrollRef.current)
    }
    onScroll()
  }, [handleResize, onScroll])

  return (
    <div ref={scrollRef} className="relative">
      {/* fixed position container for circle and hexagons, position updated in `scroll callback` */}
      <div ref={containerRef} className="h-screen fixed top-0 left-0 w-full overflow-hidden">
        {/* the circle itself */}
        <div
          ref={circleRef}
          className="
            absolute-center w-[70vmin] h-[70vmin] md:w-[60vmin] md:h-[60vmin]
            border-[8px] md:border-[14px] border-accent rounded-full
          "
        >
          <div className="absolute-center container text-center w-[95%]">
            <PrismicRichText field={circleCenterCopy} components={circleCenterComponents} />
          </div>
        </div>
        {/* hexagons on circle */}
        {items.map((item, itemIndex) => (
          <Hexagon
            key={`tri-item--${itemIndex}`}
            ref={hexRefs[itemIndex]}
            onClick={() => skipTo(itemIndex)}
          >
            {asText(item.hexWord)}
          </Hexagon>
        ))}
      </div>
      {/* Section content blocks */}
      {items.map(({ hexWord, breakoutPage }, itemIndex) => breakoutPage.slices && (
        <div
          ref={sectionRefs[itemIndex]}
          key={`page--${asText(hexWord)}`}
          className="fix-clip-path relative pointer-events-none"
          style={{
            paddingTop: `${sectionSpacing * 100}vh`,
            paddingBottom: `${sectionSpacing * 100 / 3}vh`,
          }}
        >
          <div className="pointer-events-auto">
            <Sections page={breakoutPage} padFirstSection={false} />
          </div>
        </div>
      ))}
    </div>
  )
})

TriCycle.displayName = 'TriCycle'
