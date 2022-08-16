import { SpringValue } from '@react-spring/core'
import { Chance } from 'chance'
import { breakpoints } from 'lib/constants/styles'
import { clamp } from 'lib/utils/clamp'
import { modulo } from 'lib/utils/modulo'
import { interpolate, range } from 'lib/utils/range'
import { Bodies, Body, Composite, Constraint, Engine, Runner, Vector } from 'matter-js'
import { createRef } from 'react'
import {
  ACTIVE_ITEM_DURATION,
  ENABLE_RANDOM_HEXAGON_HIDDEN,
  HEX_COLOR_IMAGE_COUNT,
  HEX_GRAYSCALE_IMAGE_COUNT,
  grid,
  hexDWtoWidthRatio,
  hexHeightToSegmentRatio,
  hexHeightToWidthRatio,
  hexImagePath,
  overlayTypes,
} from './constants'

const chance = new Chance(Date.now())

let currentColorImageIndex = 0
let currentGrayscaleImageIndex = 0

const defaultActiveItems = Object.values(overlayTypes).map((type) => type.word)
const getActiveItems = () => defaultActiveItems.map((item) => ({
  copy: item,
  spring: new SpringValue(0, { config: { tension: 65 } }),
}))

export class HexagonEngine {
  constructor({
    wrapper,
    container,
    hexGap = 2,
    hexStroke = 8,
    mouseForce = 0.9,
    mouseForceRadius = 2,
    loadCallback,
    initCallback,
    setActiveItemClicked,
  }) {
    this.wrapper = wrapper
    this.container = container
    this._hexGap = hexGap
    this._hexStroke = hexStroke
    this.mouseForce = mouseForce
    this.mouseForceRadius = mouseForceRadius
    this.activeItems = getActiveItems()
    this.loadCallback = loadCallback
    this.initCallback = initCallback
    this.setActiveItemClicked = setActiveItemClicked
    this.loaded = false
    this.paused = false

    this.loadedSpring = new SpringValue(0, { config: { tension: 32, mass: 10 } })

    this.animationFrame = null
    this.active = false
    this.engine = Engine.create({ gravity: { scale: 0 }, constraintIterations: 8 })
    this.world = this.engine.world
    this.runner = Runner.create()
    this.hexagons = []
    this.disallowReinit = false
    this.queueReinit = false
    this.cancelActiveItemTimeout = null

    this.init = this.init.bind(this)
    this.animate = this.animate.bind(this)
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.kill = this.kill.bind(this)
    this.onActiveItemClick = this.onActiveItemClick.bind(this)
    this.cancelActiveItem = this.cancelActiveItem.bind(this)
  }

  get hexGap() {
    return this._hexGap * this.hexWidth / 200
  }

  get hexStroke() {
    return this._hexStroke * this.hexWidth / 200
  }

  get isMobile() {
    return this.breakpoint === 0
  }

  init() {
    if (this.disallowReinit) {
      this.queueReinit = true
      return
    }
    // refill active items
    let currentActiveItemIndex = 0

    const {
      width: containerWidth,
      height: containerHeight,
    } = this.container.getBoundingClientRect()
    const { width: wrapperWidth } = this.wrapper.getBoundingClientRect()

    this.breakpoint = Object.values(breakpoints).findIndex((bp) => window.innerWidth < bp)
    const gridDimensions = grid[this.breakpoint] ?? grid[2]

    // compute some dimensions
    this.columnCount = gridDimensions.width
    this.columnSize = gridDimensions.height

    const gridMaxWidth = this.breakpoint === 0 ? wrapperWidth : containerWidth

    const hexWidth_w = gridMaxWidth
      / ((this.columnCount - ((this.columnCount - 1) * hexDWtoWidthRatio)))
    const hexHeight_w = hexWidth_w * hexHeightToWidthRatio
    const hexHeight_h = containerHeight / (this.columnSize + (this.isMobile ? 1 : 0.5))

    this.hexHeight = Math.min(hexHeight_w, hexHeight_h)

    this.hexWidth = this.hexHeight / hexHeightToWidthRatio
    this.hexSegLength = this.hexHeight / hexHeightToSegmentRatio

    const hexDiagWidth = (this.hexWidth - this.hexSegLength) / 2
    const evenColumnCount = this.columnCount - (this.columnCount % 2)
    const hexGridWidth = (evenColumnCount / 2 * (this.hexWidth + this.hexSegLength))
      + (this.columnCount % 2 === 0 ? hexDiagWidth : this.hexWidth)
    const widthDifference = wrapperWidth - hexGridWidth

    // clear old hexagons
    Composite.clear(this.world)

    // (re)set hexagon array
    this.hexagons = []

    const minSkipCount = this.columnCount * this.columnSize * 0.2
    let currentSkipCount = 0

    const loadSpringValue = this.loadedSpring.get()

    // compute overall x and y offsets for entire hex grid
    const firstOffsetCol = this.isMobile ? 0 : 1
    const gridOffsetX = this.hexWidth / 2 + widthDifference / 2
    const heightDiff = this.isMobile
      ? (containerHeight - ((this.columnSize + 1) * this.hexHeight))
      : (containerHeight - ((this.columnSize + 0.5) * this.hexHeight))
    const gridOffsetY = (Math.max(0, heightDiff) / 2) + (this.hexHeight / 2)
    const maxOffsetY = gridOffsetY + containerHeight - this.hexHeight
    const activeGridRows = new Set([
      chance.integer(gridDimensions.activeOffset.y),
      this.columnSize - 1 - chance.integer(gridDimensions.activeOffset.y),
    ])
    const activeGridColumns = new Set([
      chance.integer(gridDimensions.activeOffset.x),
      this.columnCount - 1 - chance.integer(gridDimensions.activeOffset.x),
    ])

    for (let x = 0; x < this.columnCount; x++) {
      // find overall y offset for current column
      let colOffsetY = gridOffsetY + (x % 2 === firstOffsetCol ? 0 : this.hexHeight / 2)

      if (this.isMobile) colOffsetY = gridOffsetY + x * this.hexHeight / 2

      // find x coordinate of center of all hexagons in current column
      const hexCenterX = gridOffsetX + ((this.hexWidth / 2 + this.hexSegLength / 2) * x)
      for (let y = 0; y < this.columnSize; y++) {
        // decide whether the current hexagon is interactive with text

        const isActiveGridRow = activeGridRows.has(y)
        const isActiveGridColumn = activeGridColumns.has(x)
        const isActiveItem = isActiveGridRow && isActiveGridColumn
        const skipLikelihood = ENABLE_RANDOM_HEXAGON_HIDDEN
          ? 20 + ((minSkipCount - currentSkipCount) / minSkipCount) * 30
          : 0
        const skip = !isActiveItem && chance.bool({ likelihood: clamp(skipLikelihood, 0, 100) })
        currentSkipCount += skip ? 1 : 0
        if (skip) continue

        // find y coordinate of center of current hexagon
        const hexCenterY = colOffsetY + (y * this.hexHeight)

        // generate random load range for load in animation
        const loadRange = {}

        loadRange.from = (1 - (hexCenterY / maxOffsetY)) * 0.5
          + chance.floating({ min: 0, max: 0.1 }) // add a bit of random staggering
        loadRange.to = loadRange.from + 0.4

        const hexLoadValue = range(
          loadSpringValue,
          loadRange.from,
          loadRange.to - loadRange.from,
        )

        const startY = interpolate(hexLoadValue, -this.hexHeight * 2, hexCenterY)

        // create polygon in physics engine
        const body = Bodies.polygon(
          hexCenterX,
          startY,
          6, // # of sides
          this.hexWidth / 2 - this.hexGap, // radius
          { // options
            angle: Math.PI / 2,
            inertia: Number.POSITIVE_INFINITY,
            friction: 0,
            frictionAir: 0.35,
            slop: 0,
            density: 0.001,
            collisionFilter: { group: -1 }, // group -1 for no collisions during load
            plugin: { isActiveItem },
          },
        )

        // create spring constraint for hex body
        const constraint = Constraint.create({
          bodyA: body,
          pointB: { x: hexCenterX, y: startY },
          damping: 1,
          stiffness: 0.005,
        })

        // if hex has copy, grab the next active item data
        let currentActiveItem
        let currentImage

        const colorImageMargin = Math.round(this.columnSize / 4) - 1

        if (isActiveItem) {
          currentActiveItem = this.activeItems[currentActiveItemIndex]
          this.activeItems[currentActiveItemIndex]
          currentActiveItemIndex += 1
        }
        else {
          const useColorImage = y === colorImageMargin
            || y === this.columnSize - 1 - colorImageMargin

          let imageFileName
          if (useColorImage) {
            imageFileName = `color-hexagon-${currentColorImageIndex + 1}.png`
            currentColorImageIndex = modulo(
              currentColorImageIndex + 1,
              HEX_COLOR_IMAGE_COUNT,
            )
          }
          else {
            imageFileName = `grayscale-hexagon-${currentGrayscaleImageIndex + 1}.png`
            currentGrayscaleImageIndex = modulo(
              currentGrayscaleImageIndex + 1,
              HEX_GRAYSCALE_IMAGE_COUNT,
            )
          }
          currentImage = `${hexImagePath}${imageFileName}`
        }

        // create ref for hex element
        const ref = createRef()
        const currentHexIndex = this.hexagons.length
        this.hexagons.push({
          body,
          ref,
          key: chance.string({ length: 8 }),
          constraint,
          position: { x: hexCenterX, y: hexCenterY },
          loadRange,
          copy: currentActiveItem?.copy,
          image: currentImage,
          activeItem: currentActiveItem,
          activeItemIndex: currentActiveItem ? currentActiveItemIndex - 1 : null,
          onClick: currentActiveItem ? () => this.onActiveItemClick(currentHexIndex) : null,
          onCancel: currentActiveItem ? () => this.cancelActiveItem(currentHexIndex) : null,
        })
      }

      this.loadedSpring.start(1)
      this.initCallback()
    }

    const worldBodies = this.hexagons.reduce((acc, { body, constraint }) => {
      acc.push(body, constraint)
      return acc
    }, [])

    // add all bodies to the physics world
    Composite.add(this.world, worldBodies)
  }

  animate() {
    this.animationFrame = window.requestAnimationFrame(this.animate)

    if (this.queueReinit && !this.disallowReinit) {
      this.queueReinit = false
      this.init()
      return
    }

    const mouse = this.mouse?.get()
    if (!mouse) return

    const {
      top,
      left,
      width: wrapperWidth,
      height: wrapperHeight,
    } = this.wrapper.getBoundingClientRect()
    const maxScreenDim = Math.max(window.innerHeight, window.innerWidth)
    const mousePos = {
      x: this.mouse.springs.x.goal * window.innerWidth - left,
      y: this.mouse.springs.y.goal * window.innerHeight - top,
    }
    const mdx2 = this.mouse.springs.x.velocity ** 2
    const mdy2 = this.mouse.springs.y.velocity ** 2
    const screenDiagonal = Math.sqrt((window.innerWidth ** 2) + (window.innerHeight ** 2))
    const mouseVelocity = Math.sqrt(mdx2 + mdy2) * screenDiagonal / 2

    // compute collision group (-1 while loading, 0 when done)
    const collisionGroup = Math.floor(this.loadedSpring.get()) - 1
    const loadSpringValue = this.loadedSpring.get()

    // update svg shape positions
    for (const { body, ref, constraint, position, loadRange, activeItem } of this.hexagons) {
      const hexLoadValue = range(
        loadSpringValue,
        loadRange.from,
        loadRange.to - loadRange.from,
      )
      // set collision group
      body.collisionFilter.group = collisionGroup
      // update constraint point for load in animaiton
      constraint.pointB.y = interpolate(hexLoadValue, -this.hexHeight * 2, position.y)
      const vectorFromMouse = Vector.sub(body.position, mousePos)
      const distFromMouse = Vector.magnitude(vectorFromMouse)
      const forceRadius = this.mouseForceRadius * this.hexSegLength
      const forceMagnitude = this.mouseForce * clamp(forceRadius / distFromMouse, 0, 1)
      const forceVector = Vector.mult(
        Vector.normalise(vectorFromMouse),
        forceMagnitude * mouse.init * mouseVelocity * loadSpringValue,
      )
      Body.applyForce(body, mousePos, forceVector)


      // update html element
      if (ref.current) {
        const width = this.hexWidth - this.hexStroke
        const height = this.hexHeight - this.hexStroke

        let posX = body.position.x
        let posY = body.position.y
        let scale = 1
        if (activeItem) {
          const springVal = activeItem.spring.get()
          posX = interpolate(springVal, posX, wrapperWidth / 2)
          posY = interpolate(springVal, posY, wrapperHeight / 2)
          scale = 1 + springVal * 2 * maxScreenDim / this.hexWidth
          const hexContent = ref.current.querySelector('.hex-content')
          if (hexContent) hexContent.style.opacity = Math.max(0, 1 - springVal * 5)
        }

        ref.current.style.width = `${width}px`
        ref.current.style.height = `${height}px`
        ref.current.style.transform = `
          translate3d(calc(${posX}px - 50%), calc(${posY}px - 50%),0)
          rotate(${body.angle * 180 / Math.PI - 90}deg)
          scale(${scale})
        `
      }
    }

    if (!this.loaded && loadSpringValue > 0.25) {
      this.loaded = true
      if (this.loadCallback) this.loadCallback()
    }
  }

  onActiveItemClick(hexIndex) {
    if (this.paused) return
    if (this.setActiveItemClicked) {
      this.setActiveItemClicked(this.hexagons[hexIndex].activeItem.copy)
    }
    this.paused = true
    this.activeItemIndex = hexIndex
    this.hexagons[hexIndex].activeItem.spring.start(1)
    this.disallowReinit = true

    // reset z-indexes of other hexagons
    for (const { activeItem, ref } of this.hexagons) {
      if (activeItem && ref.current) ref.current.style.zIndex = 1
    }

    if (this.hexagons[hexIndex].ref.current) {
      this.hexagons[hexIndex].ref.current.style.zIndex = 20
      this.hexagons[hexIndex].ref.current.classList.add('pointer-events-none')
      this.cancelActiveItemTimeout = window.setTimeout(
        () => this.cancelActiveItem(),
        ACTIVE_ITEM_DURATION,
      )
    }
  }

  cancelActiveItem() {
    if (typeof this.cancelActiveItemTimeout === 'number') {
      window.clearTimeout(this.cancelActiveItemTimeout)
    }
    if (typeof this.activeItemIndex === 'number') {
      const hexIndex = this.activeItemIndex
      if (this.hexagons[hexIndex]?.activeItem) {
        this.hexagons[hexIndex].activeItem.spring.start(0).then(() => {
          if (this.hexagons[hexIndex]?.activeItem && this.hexagons[hexIndex].ref.current) {
            this.hexagons[hexIndex].ref.current.classList.remove('pointer-events-none')
            this.hexagons[hexIndex].ref.current.style.zIndex = 1
          }
          this.disallowReinit = false
        })
        this.paused = false
        if (this.setActiveItemClicked) this.setActiveItemClicked(false)
      }
    }
  }

  start() {
    this.stop()
    this.active = true
    Runner.run(this.runner, this.engine)
    this.animationFrame = window.requestAnimationFrame(this.animate)
  }

  stop() {
    this.active = false
    if (this.animationFrame) window.cancelAnimationFrame(this.animationFrame)
    if (this.runner.enabled) Runner.stop(this.runner)
  }

  get hexData() {
    return this.hexagons.map(({ ref, key, copy, image, onClick, activeItemIndex }) => ({
      ref,
      key,
      copy,
      image,
      onClick,
      width: this.hexWidth - this.hexGap - this.hexStroke,
      height: this.hexHeight - this.hexGap - this.hexStroke,
      activeItemIndex,
    }))
  }

  kill() {
    this.stop()
  }
}
