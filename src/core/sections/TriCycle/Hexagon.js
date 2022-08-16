import { forwardRef } from 'react'

export const Hexagon = forwardRef(({ children, onClick, ...rest }, ref) => (
  <div ref={ref} {...rest} onClick={onClick} className="absolute-center w-full h-full z-10 text-accent hover:cursor-pointer pointer-events-none bg-transparent">
    <span className="z-10 hex-word text-white absolute-center font-bold">{children}</span>
    <svg viewBox="0 0 100 86.65" className="relative pointer-events-auto h-full w-full">
      <polygon points="24.906,86.65 0,43.325 24.906,0 75,0 100,43.325 75,86.65" fill="currentColor" />
    </svg>
  </div>
))

Hexagon.displayName = 'Hexagon'
