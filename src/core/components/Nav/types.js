import { arrayOf, object } from 'prop-types'

export const NavProps = {
  primaryNav: arrayOf(object),
  secondaryNav: arrayOf(object),
  socialLinks: arrayOf(object),
}
