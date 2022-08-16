import { useEffect, useMemo, useRef, useState } from 'react'
import { useInterval } from './useInterval'

function modulo(n, m) {
  return ((n % m) + m) % m
}

const configDefault = {
  auto: false,
  interval: 10_000,
  autoTimeout: 5000,
}

export function useCarousel(numberElements, config) {
  const options = useMemo(() => ({ ...configDefault, ...config }), [config])

  const indexRef = useRef(0)
  const [index, setIndex] = useState(indexRef.current)
  const [previousIndex, setPreviousIndex] = useState(indexRef.current)
  const [isRotating, setIsRotating] = useState(options.auto)

  function updateIndex(n) {
    setPreviousIndex(indexRef.current)
    indexRef.current = n
    setIndex(indexRef.current)
  }

  function rotateIndex(n = 1) {
    updateIndex(modulo(index + n, numberElements))
  }

  function next() {
    rotateIndex(1)
    setIsRotating(false)
  }

  function previous() {
    rotateIndex(-1)
    setIsRotating(false)
  }

  function set(n) {
    updateIndex(n)
    setIsRotating(false)
  }

  function autoRotate() {
    setIsRotating(true)
  }

  useEffect(() => {
    if (options.auto && options.autoTimeout > 0 && !isRotating) {
      const timeout = window.setTimeout(autoRotate, options.autoTimeout)
      return () => {
        window.clearTimeout(timeout)
      }
    }
  }, [index, isRotating, options])

  useInterval(rotateIndex, options.auto && isRotating ? options.interval : null)

  const controls = { set, next, prev: previous }

  return [index, controls, previousIndex]
}
