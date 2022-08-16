import { createRef, useRef } from 'react'

export function useRefs(array) {
  const refs = useRef([])
  refs.current = [...array].map((_, index) => refs.current[index] || createRef())
  return refs.current
}
