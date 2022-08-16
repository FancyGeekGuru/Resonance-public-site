import { useCallback, useContext } from 'react'
import { UIDispatchContext, UIStateContext, actions } from 'core/context/ui'

/**
 * UI state hook
 */
export function useUIState() {
  const state = useContext(UIStateContext)
  return state
}

/**
 * UI dispatch hook
 */
export function useUIDispatch() {
  const dispatch = useContext(UIDispatchContext)

  const openMobileNav = useCallback(() => {
    dispatch({
      type: actions.NAV,
      payload: true,
    })
  }, [dispatch])

  const closeMobileNav = useCallback(() => {
    dispatch({
      type: actions.NAV,
      payload: false,
    })
  }, [dispatch])

  return {
    openMobileNav,
    closeMobileNav,
  }
}

/**
 * UI context hook
 */
export function useUI() {
  return [useUIState(), useUIDispatch()]
}
