// Detects logo within prismic rich text node
export const detectLogo = (children) => children.length === 1 && children[0].props.children.length === 1 && children[0].props.children[0].props.children === 'ONE'
