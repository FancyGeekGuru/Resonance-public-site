/**
 * UI state context. Components wrapped in UIContextProvider have
 * access to state via `useUIState` hook, dispatch via `useUIDispatch`
 * hook, or both as a tuple with the `useUI` hook.
 *
 * @exports actions
 * @exports UIStateContext
 * @exports UIDispatchContext
 * @exports UIContextProvider
 */

import { node } from 'prop-types'
import { createContext, useReducer } from 'react'

// Actions
export const actions = {
  NAV: 'NAV',
}

// Reducer
export function reducer(state, action) {
  switch (action.type) {
    case actions.NAV:
      return {
        ...state,
        navOpen: action.payload,
      }
    default:
      return state
  }
}

const defaultValue = {
  navOpen: false,
}

// Context
export const UIStateContext = createContext(defaultValue)
export const UIDispatchContext = createContext()

// Provider
export function UIProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, defaultValue)
  return (
    <UIStateContext.Provider value={state}>
      <UIDispatchContext.Provider value={dispatch}>
        {children}
      </UIDispatchContext.Provider>
    </UIStateContext.Provider>
  )
}

UIProvider.propTypes = {
  children: node,
}
