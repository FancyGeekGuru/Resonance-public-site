import Chance from 'chance'
import { useRefs } from 'lib/hooks/useRefs'
import { modulo } from 'lib/utils/modulo'
import Image from 'next/image'
import React, { useCallback, useEffect, useRef } from 'react'

const chance = new Chance(Date.now())
const shirtIntervalRange = { min: 300, max: 500 }

const imageCount = 10
const imageSources = Array.from({ length: imageCount }, (_, i) => `/images/shirts/${i + 1}.png`)
const allImageSources = [...imageSources, ...imageSources, ...imageSources, ...imageSources]

const getShirtInterval = () => chance.integer(shirtIntervalRange)

export const CreationAnimation = () => {
  const imageRefs = useRefs(allImageSources)
  const currentImageIndex = useRef(0)
  const timeout = useRef()

  const nextShirt = useCallback(() => {
    const currentIndex = currentImageIndex.current
    const imageRef = imageRefs[currentIndex]

    const offsetAngle = chance.floating({ min: 0, max: Math.PI * 4 })
    const offset = {
      x: Math.cos(offsetAngle) / 8,
      y: Math.sin(offsetAngle) / 8,
    }
    imageRef.current.style.transition = ''
    const txInitial = ((offset.x) - 0.5) * 100
    const tyInitial = ((offset.y) - 0.5) * 100
    imageRef.current.style.transform = `translate(${txInitial}%, ${tyInitial}%) scale(0.1)`
    imageRef.current.style.zIndex = allImageSources.length - currentIndex
    imageRef.current.style.opacity = 0
    imageRef.current.style.filter = 'blur(50px)'

    window.requestAnimationFrame(() => {
      if (imageRef.current) {
        imageRef.current.style.transition = `
          transform 3.5s ease-in,
          opacity 0.75s ease,
          filter 0.75s ease
        `
        window.requestAnimationFrame(() => {
          if (imageRef.current) {
            imageRef.current.style.opacity = 1
            imageRef.current.style.filter = 'blur(0)'
            const txFinal = ((30 * offset.x) - 0.5) * 100
            const tyFinal = ((30 * offset.y) - 0.5) * 100
            imageRef.current.style.transform = `translate(${txFinal}%, ${tyFinal}%) scale(3)`
          }
        })
      }
    })

    currentImageIndex.current = modulo(currentIndex + 1, allImageSources.length)
    timeout.current = window.setTimeout(nextShirt, getShirtInterval())
  }, [imageRefs])

  useEffect(() => {
    nextShirt()
    return () => {
      if (timeout.current) window.clearTimeout(timeout.current)
    }
  }, [nextShirt])

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black animate-[fade-in] pointer-events-none">
      {allImageSources.map((source, sourceIndex) => (
        <div
          key={`${source}${sourceIndex}`}
          ref={imageRefs[sourceIndex]}
          className="
            absolute top-1/2 left-1/2 w-[100vmin] h-[100vmin]
            origin-center opacity-0 perspective
          "
        >
          <Image src={source} layout="fill" alt="" objectFit="contain" objectPosition="center" />
        </div>
      ))}
    </div>
  )
}
