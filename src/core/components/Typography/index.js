import { Logo } from 'core/components/Icons/Logo'
import { useInView } from 'react-intersection-observer'
import { classNames } from 'lib/utils/classNames'
import { detectLogo } from './utils'

// Inline logo component for Prismic RichText
export const InlineLogo = ({ children }) => (
  <span className="relative" aria-hidden>
    <span className="text-transparent">{children}</span>
    <Logo animate={false} className="absolute top-1/2 left-0 inline w-full translate-y-[calc(-50%-1px)]" />
  </span>
)

// Animated headings on in-view
export const AnimatedHeading = ({ children }) => {
  const [inViewRef, inView] = useInView({ threshold: 0.5, triggerOnce: true })
  return (
    <div
      ref={inViewRef}
      className={classNames(
        'transition-[opacity,transform] duration-700 ease-ease',
        inView ? 'opacity-100' : 'opacity-0',
      )}
    >
      {children}
    </div>
  )
}

export const defaultComponents = {
  heading1: ({ children }) => (
    <AnimatedHeading>
      <h1 className="type-h1 min-h-[1em]">{children}</h1>
    </AnimatedHeading>
  ),
  heading2: ({ children }) => (
    <AnimatedHeading>
      <h2 className="type-h2 min-h-[1em]">{children}</h2>
    </AnimatedHeading>
  ),
  heading3: ({ children }) => (
    <AnimatedHeading>
      <h3 className="type-h3 min-h-[1em]">{children}</h3>
    </AnimatedHeading>
  ),
  heading4: ({ children }) => <h4 className="type-h4 min-h-[1em]">{children}</h4>,
  paragraph: ({ children }) => <p className="type-body min-h-[1em]">{children}</p>,
  strong: ({ children }) => {
    const isLogo = detectLogo(children)
    return isLogo ? <InlineLogo>{children}</InlineLogo> : <strong>{children}</strong>
  },
  em: (props) => <span className="text-accent" {...props} />,
  listItem: (props) => <li className="type-body" {...props} />,
}
