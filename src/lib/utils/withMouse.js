import React, { forwardRef } from 'react'

import { MouseProvider } from 'core/context/mouse'
import { getComponentName } from 'lib/utils/getComponentName'

export function withMouse(Component, settings) {
  const WithMouse = forwardRef((props, ref) => (
    <MouseProvider {...settings}>
      <Component {...props} ref={ref} />
    </MouseProvider>
  ))

  WithMouse.displayName = `WithMouse(${getComponentName(Component)})`
  return WithMouse
}
