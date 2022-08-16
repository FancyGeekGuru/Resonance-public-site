import { useCallback } from 'react'

/* eslint-disable no-console */
export function useLocalStorage(key, initialValue) {
  const getItem = useCallback(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json
      return JSON.parse(item)
    } catch {
      // If error return initialValue
      return initialValue
    }
  }, [key, initialValue])

  const setItem = useCallback((value) => {
    // Save to local storage
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key])

  const removeItem = useCallback(() => {
    // Remove from local storage
    window.localStorage.removeItem(key)
  }, [key])

  return { getItem, setItem, removeItem }
}
