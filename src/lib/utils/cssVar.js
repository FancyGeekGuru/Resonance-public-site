/**
 * Get CSS variables from an element for use in JavaScript. Defaults to the root element (html).
 * @param {string} value Name of CSS variable
 * @param {HTMLElement} [element=document.documentElement]
 * @returns Value of CSS variable
 *
 * @example
 * ```js
 * const headerHeight = cssVar(--header-height)
 * ```
 */
export function cssVar(value, element = document.documentElement) {
  return window.getComputedStyle(element).getPropertyValue(value)
}
