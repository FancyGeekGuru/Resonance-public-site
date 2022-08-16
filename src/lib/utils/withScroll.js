import { forwardRef } from 'react'

import { ScrollProvider } from 'core/context/scroll'
import { getComponentName } from './getComponentName'

export function withScroll(Component, settings) {
  const WithScroll = forwardRef((props, ref) => (
    <ScrollProvider {...settings}>
      <Component {...props} ref={ref} />
    </ScrollProvider>
  ))

  WithScroll.displayName = `WithScroll(${getComponentName(Component)})`
  return WithScroll
}
