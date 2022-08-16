import css from 'styled-jsx/css'

export default css`
  .label {
    position: relative;
    appearance: none;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    max-width: 12em;
    min-width: 12em;
    border-radius: 1000px;
    padding: 0.5em;
    padding-left: 1em;
    padding-right: 2em;
  }

  .label::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    width: 1.75em;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent 0%, var(--foreground) 20%,
      var(--foreground) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  .label::before {
    content: '';
    background: url(/icons/chevron.svg);
    background-size: 100% 100%;
    position: absolute;
    right: -0.2em;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1em;
    height: 0.4em;
    pointer-events: none;
    z-index: 2;
  }
`
