export function getComponentName(target) {
  const targetType = process.env.NODE_ENV !== 'production'
    ? typeof target === 'string' && target
    : false
  return targetType || target.displayName || target.name || 'Component'
}
