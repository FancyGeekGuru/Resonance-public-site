import { modulo } from './modulo'

export function wrap(val, min, max) {
  const range = max - min
  return modulo(val - min, range) + min
}
