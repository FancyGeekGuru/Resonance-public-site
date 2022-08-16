/**
 * Concatenate classNames into a single string, filtering out non-truthy values.
 * @param  {...(string | false | undefined | null)} classes String or expression to join
 *
 * @example
 * ```jsx
 * <input className={classNames('form-element', error && 'has-error')} />
 * ```
 */
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
