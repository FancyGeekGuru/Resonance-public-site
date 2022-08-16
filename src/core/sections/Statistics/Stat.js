import { asText } from '@prismicio/helpers'
import { classNames } from 'lib/utils/classNames'
import { useInView } from 'react-intersection-observer'

export const Stat = ({ value, label, index }) => {
  const [inViewRef, inView] = useInView({ threshold: 0.5, rootMargin: '-20%', triggerOnce: true })
  const inClass = index % 2 === 0 ? 'translate-x-14 opacity-0' : '-translate-x-14 opacity-0'
  return (
    <p
      ref={inViewRef}
      className={classNames(
        'transition-[transform,opacity] duration-700 ease-out type-h4 max-w-6xl',
        inView ? 'translate-x-0 opacity-100' : inClass,
      )}
    >
      <span>{value}</span>&nbsp;&nbsp;
      <span>{asText(label)}</span>
    </p>
  )
}
