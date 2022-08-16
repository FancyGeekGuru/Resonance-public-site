import { clamp } from 'lib/utils/clamp'

/**
 * Linear interpolation function to translate a numerical value with an undetermined range to the linear range [0 -> 1]
 * @param {number} value input value used as interpolation value
 * @param {number} from minimum value for interpolation. When `value` === `from`, `range` returns 0.
 * @returns {number} interpolated value in range [0 -> 1]
 */
export const range = (value, from, distance) => {
  const start = from
  const end = start + distance
  return clamp((value - start) / (end - start), 0, 1)
}

/**
 * Linear interpolation function to translate a numerical value with an undetermined range to the linear range [0 -> 1]
 * @param {number} value input value used as interpolation value in range [0 -> 1]
 * @param {number} from minimum value for interpolation. When `value` === 0, `interpolate` returns value of `from`.
 * @param {number} to maximum value for interpolation. When `value` === 1, `interpolate` returns value of `to`.
 * @returns {number} interpolated value in range [`from` -> `to`]
 */
export const interpolate = (value, from, to) => {
  const min = Math.min(from, to)
  const max = Math.max(from, to)
  const fVal = from === min ? value : 1 - value
  return clamp((fVal * (max - min)) + min, min, max)
}

const { PI } = Math
const H_PI = PI / 2

/**
 * Converts a linear range value to a sin wave range value.
 * @param {number} value numerical value in range [0 -> 1]
 * @param {boolean} [full=false] if false, result will be in range [0 -> 1]; if true, result will be in range [0 -> 1 -> 0]
 * @returns sin wave range value
 */
const sin = (value, full = false) =>
  (Math.sin(value * (PI * (full ? 2 : 1)) - H_PI) + 1) / 2

/**
 * Same as `range` but result is a sin wave range as opposed to linear
 * @param {number} value input value used as interpolation value
 * @param {number} from minimum value for interpolation. When `value` === `from`, `range` returns 0.
 * @param {number} distance represents the distance from `from` to end interpolation. When `value` === `from` + `distance`, `range` returns 1.
 * @param {boolean} [full] if false, result will be in range [0 -> 1]; if true, result will be in range [0 -> 1 -> 0]
 * @returns {number} sin wave range value
 */
export const sinRange = (
  value,
  from,
  distance,
  full,
) => sin(range(value, from, distance), full)
