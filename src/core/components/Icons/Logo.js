import { classNames } from 'lib/utils/classNames'
import { bool, number, string } from 'prop-types'
import { useEffect, useState } from 'react'

export const Logo = ({
  height = 70,
  animate = true,
  color = 'currentColor',
  className,
  ...rest
}) => {
  const [visible, setVisible] = useState(!animate)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <svg
      height={height}
      viewBox="0 0 180 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
      className={classNames(className, animate && 'grayscale')}
    >
      {animate && (
        <defs>
          <mask id="mask-path">
            <path
              className={classNames(
                'path-mask z-10',
                visible ? 'path-mask-visible' : 'path-mask-hidden',
              )}
              pathLength="100"
              d="M50 10.0001C51 9.5 55 8.5 59.5 8.5C70 8.5 75 19.5 75 21.5C75 23.5 75 52 75 54C75 56 68.5035 61.5 59 61.5C48.5 61.5 42 55.5 42 53C42 50.5 42 19.5001 42 18.0001C42 16.5001 37 8.5 25.5 8.5C14 8.5 8.5 15.0001 8.5 18.0001C8.5 21.0001 8.5 51.5 8.5 54C8.5 56.5 15 61.5 24.5 61.5C28.5 61.5 30.5 61 34 59"
              stroke="white"
              strokeWidth="18"
              fill="none"
            />
          </mask>
        </defs>
      )}
      <path
        className={classNames(
          'transition-[opacity,transform] duration-300 ease-ease',
          visible
            ? 'opacity-100 delay-[0.4s] translate-x-0'
            : 'opacity-0 -translate-x-4',
        )}
        d="M136.714 1.2854V68.7701H123.19L105.369 29.9257L105.83 50.0768V68.7701H90.4609V1.2854H106.061L121.806 36.1282L121.344 16.7774V1.2854H136.714Z"
        fill={color}
      />
      <path
        className={classNames(
          'transition-[opacity,transform] duration-300 ease-ease',
          visible
            ? 'opacity-100 delay-[0.6s] translate-x-0'
            : 'opacity-0 -translate-x-4',
        )}
        d="M144.297 1.2854H179.621V14.8338H159.292V28.2393H176.334V41.4447H159.292V55.2217H179.621V68.7701H144.297V1.2854Z"
        fill={color}
      />

      <path mask={animate ? 'url(#mask-path)' : null} d="M 123.7 269.4 q -16.588 -14.538 -16.589 -42.02 v -95.33 q 0 -25.77 16.44 -39.112 t 48.129 -13.342 q 31.689 0 48.128 13.342 t 16.44 39.112 v 95.33 q 0 27.481 -16.589 42.02 t -47.979 14.539 Q 136.288 283.936 119.7 269.4 Z m 66.955 -26.455 q 6.03 -4.047 6.025 -13.4 V 131.705 q 0 -15.165 -26.507 -15.166 q -23.493 0 -23.493 14.824 v 97.953 q 0 17.675 24.1 17.674 Q 180.63 246.99 186.652 242.942 Z M 58.3927 0.0285 C 54.3716 0.0458 50.4145 1.0264 46.8583 2.8868 L 53.9807 13.8913 C 55.4338 13.3382 56.9804 13.0665 58.5368 13.091 C 64.7077 13.091 67.3317 16.2924 67.3317 20.4655 V 49.5059 C 67.3317 53.679 64.7077 56.909 58.5368 56.909 C 52.3659 56.909 49.886 53.679 49.886 49.5059 V 24.7244 C 50 20 49 16 54 14 L 47 3 C 37 8 34 15 33.5937 20.494 V 35.0143 V 45.2756 C 33.5937 51.8329 36.2216 58.1216 40.8993 62.7584 C 45.577 67.3951 51.9215 70 58.5368 70 C 65.1521 70 71.4964 67.3951 76.1741 62.7584 C 80.8519 58.1216 83.4797 51.8329 83.4797 45.2756 V 24.753 C 83.4798 21.4941 82.83 18.2673 81.5675 15.2582 C 80.305 12.2492 78.4547 9.5172 76.1233 7.2194 C 73.7918 4.9216 71.0251 3.1035 67.9822 1.8694 C 64.9393 0.6353 61.6803 0.0097 58.3927 0.0285 V 0.0285 Z M 136.714 1.2854 V 68.7701 H 123.19 L 105.369 29.9257 L 105.83 50.0768 V 68.7701 H 90.4609 V 1.2854 H 106.061 L 121.806 36.1282 L 121.344 16.7774 V 1.2854 H 136.714 Z M 144.297 1.2854 H 179.621 V 14.8338 H 159.292 V 28.2393 H 176.334 V 41.4447 H 159.292 V 55.2217 H 179.621 V 68.7701 H 144.297 V 1.2854 Z" fill={color} />
    </svg>

  )
}

Logo.propTypes = {
  height: number,
  animate: bool,
  color: string,
  className: string,
}
