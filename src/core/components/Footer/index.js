import { PrismicLink, PrismicRichText } from '@prismicio/react'
import { classNames } from 'lib/utils/classNames'
import { arrayOf, object, string } from 'prop-types'
import { useCallback, useState } from 'react'
import { Social } from '../Icons/Social'
import { defaultComponents } from '../Typography'

const isEmailValid = (email) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)
const formParagraphComponents = {
  ...defaultComponents,
  paragraph: ({ children }) => <p className="type-footer min-h-[1em]">{children}</p>,
}

// Email capture was requested to be hidden for now.
const SHOW_EMAIL_CAPTURE = false

export function Footer({ nav }) {
  const {
    primaryLinks,
    secondaryLinks,
    socialLinks,
    emailCaptureCopy,
    emailCapturePlaceholder,
    copyright,
  } = nav ?? {}
  const [formValid, setFormValid] = useState(false)

  const onFormUpdate = useCallback((event) => {
    setFormValid(isEmailValid(event.target.value))
  }, [])

  return nav && (
    <footer className="bg-black py-8 md:pt-28 md:pb-20 type-footer">
      <div className="container grid grid-cols-12 gap-x-gutter gap-y-24 md:gap-y-32">
        <div className="flex flex-col col-span-12 sm:col-span-6 md:col-span-3 gap-y-4">
          {primaryLinks.map(({ link, label }, linkIndex) => (
            <PrismicLink key={`footer-primary-nav-${linkIndex}`} field={link}>
              {label}
            </PrismicLink>
          ))}
        </div>
        <div className="flex flex-col col-span-12 sm:col-span-6 md:col-span-3 gap-y-4">
          {secondaryLinks.map(({ link, label }, linkIndex) => (
            <PrismicLink key={`footer-secondary-nav-${linkIndex}`} field={link}>
              {label}
            </PrismicLink>
          ))}
          <div className="flex space-x-4 mt-2">
            {socialLinks.map(({ type, link }) => (
              <PrismicLink key={type} field={link} className="w-6 md:w-7 h-6 md:h-7">
                <Social type={type} className="h-full" />
              </PrismicLink>
            ))}
          </div>
        </div>
        {SHOW_EMAIL_CAPTURE && (
          <div
            className="
              flex flex-col max-w-sm sm:max-w-full
              col-span-12 sm:col-span-8 md:col-span-5 md:col-start-8 lg:col-start-8
            "
          >
            <PrismicRichText field={emailCaptureCopy} components={formParagraphComponents} />
            <form className="relative rounded-full w-full mt-6 overflow-hidden">
              <input
                onChange={onFormUpdate}
                type="email"
                className={classNames(
                  'w-full bg-transparent outline-none rounded-full border-2 border-white py-4 px-6',
                  'type-footer placeholder:type-footer placeholder:text-gray appearance-none',
                  formValid
                    ? 'focus:border-aquamarine focus:ring-aquamarine'
                    : 'focus:border-yellow focus:ring-yellow',
                )}
                placeholder={emailCapturePlaceholder}
              />
              <button
                disabled={!formValid}
                type="submit"
                className="
                  absolute top-1 right-1 h-[calc(100%-8px)] px-4
                  flex items-center justify-center text-black rounded-full
                bg-white transition-all duration-500 ease-ease
                  disabled:opacity-0 disabled:translate-x-full hover:bg-grey-300
                "
              >
                Submit
              </button>
            </form>
          </div>
        )}
        <span className="type-footer col-span-12 text-white text-center">
          {copyright}
        </span>
      </div>
    </footer>
  )
}

Footer.propTypes = {
  emailCaptureCopy: object,
  emailCapturePlaceholder: string,
  primaryLinks: arrayOf(object),
  secondaryLinks: arrayOf(object),
  copyright: string,
}
