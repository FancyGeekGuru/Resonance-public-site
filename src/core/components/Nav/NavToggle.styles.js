import css from 'styled-jsx/css'

export default css`
  .nav-toggle rect {
    transition-property: transform, opacity;
    transition-timing-function: ease;
    transition-duration: 300ms;
  }

  .nav-toggle rect {
    transform-origin: center;
  }

  .nav-toggle rect:nth-child(2) {
    transform-origin: center right;
  }

  .is-open rect:nth-child(1) {
    transform: rotate(45deg) translate(0, 10px);
  }

  .is-open rect:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }

  .is-open rect:nth-child(3) {
    transform: rotate(-45deg) translate(0, -10px);
  }
`
