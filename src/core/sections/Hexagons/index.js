import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Section } from 'core/layouts/Section'
import { withMouse } from 'lib/utils/withMouse'
import { useMouse } from 'lib/hooks/useMouse'
import { classNames } from 'lib/utils/classNames'
import { useBodyLock } from 'lib/hooks/useBodyLock'
import { AnimatePresence } from 'framer-motion'
import { PrismicRichText } from '@prismicio/react'
import { useInView } from 'react-intersection-observer'
import { HexagonEngine } from './hexagonEngine'
import Hexagon from './Hexagon'
import Overlay from './Overlay'

const Hexagons = withMouse(({ slice: { primary: { heading, ...primary } }, ...rest }) => {
  const [inViewRef, inView] = useInView()
  const [initialized, setInitialized] = useState(false)
  const [hexData, setHexData] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [activeItemClicked, setActiveItemClicked] = useState(false)
  const resizeObserver = useRef()
  const resizeTimeout = useRef()
  const containerRef = useRef()
  const wrapperRef = useRef()
  const engine = useRef()
  const mouse = useMouse()

  useBodyLock(!!activeItemClicked)

  const onEngineInit = useCallback(() => {
    setHexData(engine.current.hexData)
  }, [])

  const handleResize = useCallback(() => {
    if (resizeTimeout.current) window.clearTimeout(resizeTimeout.current)
    resizeTimeout.current = window.setTimeout(() => {
      engine.current.init()
    }, 500)
  }, [])

  const handleExitOverlay = useCallback(() => {
    engine.current.cancelActiveItem()
  }, [])

  useEffect(() => {
    if (initialized && engine.current) engine.current.mouse = mouse
  }, [initialized, mouse])

  useEffect(() => {
    if (engine.current) {
      if (inView && !engine.current.active) engine.current.start()
      else if (!inView && engine.current.active) engine.current.stop()
    }
  }, [inView])

  useEffect(() => {
    if (containerRef.current && wrapperRef.current) {
      engine.current = new HexagonEngine({
        wrapper: wrapperRef.current,
        container: containerRef.current,
        mouse,
        loadCallback: () => setLoaded(true),
        initCallback: onEngineInit,
        setActiveItemClicked,
      })

      handleResize()
      resizeObserver.current = new ResizeObserver(handleResize)
      resizeObserver.current.observe(containerRef.current)

      engine.current.start()
      setInitialized(true)

      return () => {
        engine.current.kill()
        setInitialized(false)
        setHexData([])
        resizeObserver.current.disconnect()
      }
    }
  }, [handleResize, mouse, onEngineInit])

  return (
    <Section
      {...primary}
      {...rest}
      theme="white"
      className="relative overflow-hidden md:pt-[calc(var(--header-height)*0.6)]"
    >
      <div ref={inViewRef} className="relative container w-full mb-12">
        <div ref={wrapperRef} className="absolute-center w-full h-full">
          {hexData.map(({ key, ...data }) => <Hexagon key={key} {...data} />)}
        </div>
        <div
          ref={containerRef}
          className={classNames(
            'relative md:mx-0 pointer-events-none z-10 transition-opacity duration-1000 ease-ease text-black',
            'w-full h-header-safe md:h-[calc(100vh-var(--header-height)*0.6)] flex flex-col justify-center items-center bg-white-shadow text-center',
            (loaded && !activeItemClicked) ? 'opacity-100' : 'opacity-0',
          )}
        >
          <div className="md:-mt-[calc(var(--header-height)*0.4)]">
            <PrismicRichText field={heading} />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {!!activeItemClicked && (
          <Overlay type={activeItemClicked} onExit={handleExitOverlay} />
        )}
      </AnimatePresence>
    </Section>
  )
})

export default Hexagons
