import { Mark } from 'core/components/Icons/Mark'
import { classNames } from 'lib/utils/classNames'
import Image from 'next/image'
import React, { forwardRef } from 'react'

const Hexagon = forwardRef(({ width, copy, image, onClick, activeItemIndex }, ref) => (
  <div className="hex-wrapper top-0 left-0" ref={ref} onClick={onClick}>
    <div
      className={classNames(
        'w-full h-full',
        copy && 'hover:animate-[hexpulse_0.75s_ease-in]',
      )}
    >
      <div
        className={classNames(
          'relative w-full h-full',
          image && 'hex overflow-hidden bg-gray bg-opacity-30',
          copy && `
            text-background hover:text-yellow text-center hover:cursor-pointer
            animate-[hexpulse_0.75s_ease-in]
          `,
        )}
        style={{ animationDelay: `${1500 + activeItemIndex * 250}ms` }}
      >
        {!!copy && (
          <span
            className="
            absolute-center font-bold z-10
            transition-opacity ease-ease duration-300
            hex-content
          "
          // 'hex-content' class is for hex engine to target the hexagon label tst
          // and apply opacity updates to it
          >
            <span
              style={{ fontSize: `${width / 7.4}px` }}
              className="
                flex flex-nowrap items-center text-background
                transition-colors duration-500 ease-ease
              "
            >
              <Mark className="inline relative mr-1 w-[0.8em]" />
              {copy}
            </span>
          </span>
        )}
        {!!image && (
          <Image src={image} priority alt="" layout="fill" objectFit="cover" />
        )}

        {/* Hexagons without an image are subject to scale transformations which cause */}
        {/* glitchy artifacts to appear. use svg instead of clip path for these hexagons. */}
        {!image && (
          <svg
            viewBox="0 0 100 86.65"
            className="
              absolute-center pointer-events-auto h-full w-full text-foreground
              transition-colors duration-500 ease-ease
            "
          >
            <polygon points="24.906,86.65 0,43.325 24.906,0 75,0 100,43.325 75,86.65" fill="currentColor" />
          </svg>
        )}
      </div>
    </div>
  </div>
))

Hexagon.displayName = 'Hexagon'

export default Hexagon
