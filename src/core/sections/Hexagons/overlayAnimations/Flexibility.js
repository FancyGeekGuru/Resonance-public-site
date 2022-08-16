import { useMatchMedia } from 'lib/hooks/useMatchMedia'
import { mediaQueries } from 'lib/utils/mediaQueries'
import React from 'react'

const sources = [
  '/videos/likes-increasing.mp4', // mobile
  '/videos/likes-increasing.mp4', // desktop
]

export const FlexibilityAnimation = () => {
  const isMobile = !useMatchMedia(mediaQueries.md)
  const currentSource = sources[isMobile ? 0 : 1]
  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <video
        src={currentSource}
        className="absolute w-full h-full object-cover object-center"
        autoPlay
        playsInline
        loop
        muted
      />
    </div>
  )
}
