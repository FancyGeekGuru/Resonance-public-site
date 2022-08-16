import css from 'styled-jsx/css'

export default css`
  .tag {
    position: relative;
  }
  .tag::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% + 1.8em);
    height: calc(100% + 1.2em);
    border-radius: 1000px;
    z-index: -1;
  }
`
