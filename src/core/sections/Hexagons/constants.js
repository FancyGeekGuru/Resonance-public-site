import { ConnectionAnimation } from './overlayAnimations/Connection'
import { CreationAnimation } from './overlayAnimations/Creation'
import { FlexibilityAnimation } from './overlayAnimations/Flexibility'
import { ScaleAnimation } from './overlayAnimations/Scale'

export const ENABLE_RANDOM_HEXAGON_HIDDEN = true
export const hexImagePath = '/images/hex-images/'

// color image names must in the form: color-hexagon-[index].png`
// for example color-hexagon-2.png`
export const HEX_COLOR_IMAGE_COUNT = 10

// grayscale image names must in the form: grayscale-hexagon-[index].png` test
// for example grayscale-hexagon-2.png`
export const HEX_GRAYSCALE_IMAGE_COUNT = 5

export const ACTIVE_ITEM_DURATION = 4000 // in milliseconds

export const grid = [
  { // mobile
    width: 3,
    height: 4,
    activeOffset: {
      x: { min: 0, max: 0 },
      y: { min: 0, max: 0 },
    },
  },
  { // tablet
    width: 6,
    height: 4,
    activeOffset: {
      x: { min: 1, max: 1 },
      y: { min: 0, max: 0 },
    },
  },
  { // desktop
    width: 9,
    height: 4,
    activeOffset: {
      x: { min: 2, max: 3 },
      y: { min: 0, max: 0 },
    },
  },
]

export const INFINITE = 'Infinite'
export const overlayTypes = {
  creation: {
    word: 'creation',
    copy: 'at zero cost.',
    component: CreationAnimation,
  },
  connection: {
    word: 'connection',
    copy: 'with customers.',
    component: ConnectionAnimation,
  },
  scale: {
    word: 'scale',
    copy: 'with zero inventory.',
    component: ScaleAnimation,
  },
  flexibility: {
    word: 'flexibility',
    copy: 'to react in real time.',
    component: FlexibilityAnimation,
  },
}

// DO NOT CHANGE
export const hexHeightToSegmentRatio = 2 * Math.sin(Math.PI / 3)
export const hexHeightToWidthRatio = .8665
export const hexDWtoWidthRatio = 0.249_77

export const overlayVariants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.5 },
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
}
