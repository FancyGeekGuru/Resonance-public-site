import { classNames } from 'lib/utils/classNames'
import { number, string } from 'prop-types'
import { useEffect, useRef } from 'react'

export const IphoneVideo = ({ className, delay = 0, ...props }) => {
  const videoRef = useRef()

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      videoRef.current.autoPlay = true
      videoRef.current.play()
    }, delay)

    return () => window.clearTimeout(timeout)
  }, [delay])

  return (
    <div className={classNames(className, 'relative')}>
      <video ref={videoRef} controls={false} loop muted className="w-full" {...props} playsInline />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="iphone.svg"
        alt=""
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.158] z-10"
      />
    </div>
  )
}

IphoneVideo.propTypes = {
  className: string,
  delay: number,
}
