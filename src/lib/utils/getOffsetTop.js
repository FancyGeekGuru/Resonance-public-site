export function getOffsetTop(elem) { // crossbrowser version
  const box = elem.getBoundingClientRect()

  const { body } = document
  const { documentElement } = document

  const scrollTop = window.pageYOffset || documentElement.scrollTop || body.scrollTop

  const clientTop = documentElement.clientTop || body.clientTop || 0

  const top = box.top + scrollTop - clientTop

  return top
}
