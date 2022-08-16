import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { classNames } from 'lib/utils/classNames'
import { useMatchMedia } from 'lib/hooks/useMatchMedia'
import { mediaQueries } from 'lib/utils/mediaQueries'
import { interpolate } from 'lib/utils/range'
import { useEventListener } from 'lib/hooks/useEventListener'
import { useAnimationFrame } from 'lib/hooks/useAnimationFrame'
import { useInView } from 'react-intersection-observer'
import { useScrollEventListener } from 'lib/hooks/useScrollEventListener'
import { Controller, SpringValue } from '@react-spring/core'
import { useRefs } from 'lib/hooks/useRefs'
import { cssVar } from 'lib/utils/cssVar'

export const ScrollVideo = ({ mobileVideo, desktopVideo, seekSpeed = 1, items }) => {
  const [inViewRef, inView] = useInView({ threshold: 0.5 })
  const scrollRef = useRef()
  const [scrollHeight, setScrollHeight] = useState(null)
  const isLandscape = useMatchMedia(mediaQueries.landscape)
  const activeIndexRef = useRef(0)
  const videoDurationRef = useRef()
  const videoRef = useRef()
  const itemHighlightRef = useRef()
  const [activeItemIndex, setActiveIndex] = useState(0)
  const itemRefs = useRefs(items)
  const timestampSpring = useMemo(() => new SpringValue(0), [])
  const highlightSpring = useMemo(() => new Controller({ left: 0, width: 0 }), [])
  const videoSeekedRef = useRef(false)
  const canvasReadyRef = useRef(false)
  let videoSource = mobileVideo.url ?? desktopVideo.url
  if (isLandscape) videoSource = desktopVideo.url ?? mobileVideo.url

  const animate = useCallback(() => {
    if (videoSeekedRef.current) {
      videoSeekedRef.current = false
      videoRef.current.currentTime = timestampSpring.get()
    }

    const hightlight = itemHighlightRef.current
    if (itemHighlightRef.current) {
      const { left, width } = highlightSpring.get()
      hightlight.style.left = `calc(${left}px - 1em + 4px)`
      hightlight.style.width = `calc(${width}px + 2em - 8px)`
    }
  }, [highlightSpring, timestampSpring])

  const jumpTo = useCallback((index) => {
    const { height: scrollHeight, top: scrollTop } = scrollRef.current.getBoundingClientRect()
    const totalScrollHeight = scrollHeight - window.innerHeight
    const { duration } = videoRef.current
    const itemTimestamp = isLandscape
      ? items[index].desktopTimestamp
      : items[index].mobileTimestamp
    if (duration) {
      const scrollTarget = totalScrollHeight * (itemTimestamp / duration)
      const scrollChange = scrollTop + scrollTarget
      document.scrollingElement.scrollBy({ top: scrollChange, behavior: 'smooth' })
    }
  }, [isLandscape, items])

  useAnimationFrame(animate, inView)

  const handleScroll = useCallback((scrollData) => {
    if (videoRef.current && !videoDurationRef.current) {
      videoDurationRef.current = videoRef.current.duration
    }

    if (videoDurationRef.current && videoRef.current) {
      const { height: scrollHeight } = scrollRef.current.getBoundingClientRect()
      const progress = scrollData?.scrollTop
        ? (scrollData?.scrollTop - window.innerHeight) / (scrollHeight - window.innerHeight)
        : 0
      const newTimestamp = Math.round(interpolate(progress, 0, videoDurationRef.current))
      timestampSpring.start(newTimestamp)
      let currentStepIndex = -1
      for (const item of items) {
        const itemTimestamp = isLandscape ? item.mobileTimestamp : item.desktopTimestamp
        if (itemTimestamp <= newTimestamp) currentStepIndex += 1
        else break
      }
      if (activeIndexRef.current !== currentStepIndex) {
        activeIndexRef.current = currentStepIndex
        setActiveIndex(currentStepIndex)
      }
    }
  }, [timestampSpring, isLandscape, items])

  const handleResize = useCallback(() => {
    if (videoRef.current) {
      const screenHeight = Number.parseFloat(cssVar('--ivh', scrollRef.current)) * 100
      setScrollHeight(screenHeight * videoRef.current.duration / seekSpeed)
    }
  }, [seekSpeed])

  useEventListener('resize', handleResize)
  useScrollEventListener(handleScroll, inView, scrollRef)

  useEffect(() => {
    const currentItem = itemRefs[activeItemIndex]?.current
    if (currentItem) {
      const { left: pLeft } = currentItem.parentElement.parentElement.getBoundingClientRect()
      const { left, width } = currentItem.getBoundingClientRect()
      highlightSpring.start({ left: left - pLeft, width })
    }
  }, [activeItemIndex, highlightSpring, itemRefs])

  useEffect(() => {
    if (videoRef.current) {
      canvasReadyRef.current = false
      const handleVideoSeeked = () => {
        videoSeekedRef.current = true
      }

      // make video think it is playing so it will buffer
      videoRef.current.currentTime = 0.001

      handleVideoSeeked()
      handleScroll()
      videoRef.current.addEventListener('seeked', handleVideoSeeked)
      videoRef.current.addEventListener('loadedmetadata', handleResize)
      if (videoRef.current.duration) handleResize()
    }
  }, [handleResize, handleScroll, videoSource])

  return (
    <div
      ref={scrollRef}
      style={{ height: scrollHeight ? `${scrollHeight}px` : `${items.length * 100}vh` }}
      className="relative min-h-header-safe"
    >
      <div
        ref={inViewRef}
        className="
          sticky overflow-hidden
          h-screen max-h-screen w-full top-0 left-0 pt-header-height
        "
      >
        {items.length > 0 && (
          <div
            className="
              absolute top-screen-responsive left-1/2 -translate-x-1/2 translate-y-[calc(-100%-24px)]
              container flex justify-center z-10 type-h4 transition-[top]
            "
          >
            <div
              className={classNames(
                'relative bg-black text-white px-[1em] py-4 rounded-full transition-opacity',
                inView ? 'opacity-100' : 'opacity-0',
              )}
            >
              <div className="absolute bg-accent rounded-full min-h-[calc(100%-8px)] top-1/2 -translate-y-1/2" ref={itemHighlightRef} />
              <div className="relative flex space-x-[1.5em]">
                {items.map(({ label }, itemIndex) => (
                  <button
                    ref={itemRefs[itemIndex]}
                    onClick={() => jumpTo(itemIndex)}
                    key={`step--${label}`}
                    className="relative transition-opacity ease-ease"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <video
          ref={videoRef}
          src={videoSource}
          muted
          playsInline
          className={classNames(
            'absolute-center h-full z-0 transition-opacity duration-500 ease-ease object-cover object-center',
            inView ? 'opacity-100' : 'opacity-0',
          )}
        />
      </div>
    </div>
  )
}
