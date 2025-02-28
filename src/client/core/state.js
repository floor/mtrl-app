// src/client/core/state/index.js

/**
 * Simple state management utility for persistent application state
 * @returns {Object} State management methods
 */
export const createStateManager = () => {
  const STORAGE_KEY = 'mtrl-app-state'
  let state = {}

  // Initialize state from localStorage if available
  try {
    const savedState = localStorage.getItem(STORAGE_KEY)
    if (savedState) {
      state = JSON.parse(savedState)
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error)
  }

  // Save current state to localStorage
  const persistState = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error('Failed to save state to localStorage:', error)
    }
  }

  return {
    /**
     * Get a value from state by key
     * @param {string} key - State key to retrieve
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} The stored value or defaultValue
     */
    get: (key, defaultValue = null) => {
      return state[key] !== undefined ? state[key] : defaultValue
    },

    /**
     * Set a value in state and persist to localStorage
     * @param {string} key - State key to update
     * @param {*} value - Value to store
     * @returns {*} The stored value
     */
    set: (key, value) => {
      state[key] = value
      persistState()
      return value
    },

    /**
     * Remove a key from state
     * @param {string} key - State key to remove
     */
    remove: (key) => {
      delete state[key]
      persistState()
    },

    /**
     * Get all state as an object
     * @returns {Object} Current state
     */
    getAll: () => ({ ...state }),

    /**
     * Clear all state
     */
    clear: () => {
      state = {}
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.error('Failed to clear localStorage:', error)
      }
    }
  }
}

// Create and export a singleton instance
const stateManager = createStateManager()
export default stateManager
