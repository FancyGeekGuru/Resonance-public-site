import React, { useCallback, useRef, useState } from 'react'
import { PrismicRichText } from '@prismicio/react'
import { Section } from 'core/layouts/Section'
import { defaultComponents } from 'core/components/Typography'
import { classNames } from 'lib/utils/classNames'
import { useEventListener } from 'lib/hooks/useEventListener'
import { Stat } from './Stat'

const formulasComponents = {
  ...defaultComponents,
  paragraph: (props) => (
    <p className="type-body-small" {...props} />
  ),
}

const Statistics = ({
  slice: {
    primary: { heading, formulas, ...primary },
    items,
  },
  ...rest
}) => {
  const forumlasRef = useRef()
  const [formulasHeight, setFormulasHeight] = useState(0)
  const [formulasShown, setFormulasShown] = useState(false)

  const toggleFormulas = useCallback(() => setFormulasShown((previous) => !previous), [])
  const handleResize = useCallback(() => {
    const { height } = forumlasRef.current.getBoundingClientRect()
    setFormulasHeight(height)
  }, [])

  useEventListener('resize', handleResize, { initial: true })

  return (
    <Section {...primary} {...rest} className="container text-center flex flex-col items-center">
      <div className="mb-xl col-span-12">
        <PrismicRichText field={heading} />
      </div>
      <div className="flex flex-col items-center space-y-4">
        {items.map((item, itemIndex) => (
          <Stat key={`statistic--${item.value}-${itemIndex}`} {...item} index={itemIndex} />
        ))}
      </div>
      <button onClick={toggleFormulas} className="type-footer underline mt-14">*Formulas</button>
      <div
        className={classNames(
          'transition-all duration-500 ease-ease overflow-hidden mt-14',
          formulasShown ? 'delay-0' : 'delay-[400]',
        )}
        style={{ height: formulasShown ? `${formulasHeight}px` : '0px' }}
      >
        <div
          ref={forumlasRef}
          className={classNames(
            'rounded-full bg-white text-black px-20 py-20 text-left transition-opacity duration-500',
            formulasShown ? 'opacity-100 delay-[400]' : 'opacity-0 delay-0',
          )}
        >
          <PrismicRichText field={formulas} components={formulasComponents} />
        </div>
      </div>
    </Section>
  )
}

export default Statistics
