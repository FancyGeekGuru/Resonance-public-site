import { SliceSimulator } from '@prismicio/slice-simulator-react'
import { SliceZone } from '@prismicio/react'

import { components } from 'core/sections'
import state from '../../.slicemachine/libraries-state.json'

const SliceSimulatorPage = () => (
  <div className="theme-wrapper" data-theme="white">
    <SliceSimulator
      sliceZone={({ slices }) => <SliceZone slices={slices} components={components} />}
      state={state}
    />
  </div>
)

export default SliceSimulatorPage
