/**
 * Convert pixel value to relative unit, based on the root font size `16px`.
 * @param {'em'|'rem'} unit Relative unit to convert to
 * @returns {function(number|string): string}
 */
const pxToRelUnit = (unit) => (value) => `${Number.parseFloat(value) / 16}${unit}`

module.exports = {
  pxToEm: pxToRelUnit('em'),
  pxToRem: pxToRelUnit('rem'),
}
