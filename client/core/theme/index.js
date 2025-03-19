// src/client/core/theme/index.js
import stateManager from '../state'

// Theme constants
const THEME_MODE_KEY = 'themeMode'
const THEME_NAME_KEY = 'themeName'
const DEFAULT_THEME = 'ocean'
const DEFAULT_MODE = 'light'

// SVG icons
const DARK_MODE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
</svg>`

const LIGHT_MODE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="5"/>
  <line x1="12" y1="1" x2="12" y2="3"/>
  <line x1="12" y1="21" x2="12" y2="23"/>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
  <line x1="1" y1="12" x2="3" y2="12"/>
  <line x1="21" y1="12" x2="23" y2="12"/>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
</svg>`

// Events
const EVENTS = {
  THEME_CHANGE: 'themeChange',
  MODE_CHANGE: 'modeChange'
}

/**
 * Theme service to manage theme and dark mode with persistence
 */
export const createThemeService = () => {
  // Event listeners
  const listeners = {
    [EVENTS.THEME_CHANGE]: new Set(),
    [EVENTS.MODE_CHANGE]: new Set()
  }

  /**
   * Apply theme settings to DOM
   * @param {string} themeName - Theme name to apply
   * @param {string} themeMode - Theme mode (light/dark)
   */
  const applyTheme = (themeName, themeMode) => {
    document.body.setAttribute('data-theme', themeName)
    document.body.setAttribute('data-theme-mode', themeMode)
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  const on = (event, callback) => {
    if (listeners[event] && typeof callback === 'function') {
      listeners[event].add(callback)
    }
    return () => off(event, callback) // Return cleanup function
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function to remove
   */
  const off = (event, callback) => {
    if (listeners[event]) {
      listeners[event].delete(callback)
    }
  }

  /**
   * Trigger an event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  const trigger = (event, data) => {
    if (listeners[event]) {
      listeners[event].forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in ${event} listener:`, error)
        }
      })
    }
  }

  // Initialize theme from localStorage or defaults
  const init = () => {
    const themeName = stateManager.get(THEME_NAME_KEY, DEFAULT_THEME)
    const themeMode = stateManager.get(THEME_MODE_KEY, DEFAULT_MODE)

    applyTheme(themeName, themeMode)
    return { themeName, themeMode }
  }

  return {
    /**
     * Initialize theme service
     * @returns {Object} Current theme settings
     */
    init,

    /**
     * Get current theme settings
     * @returns {Object} Current theme settings
     */
    getSettings: () => ({
      themeName: stateManager.get(THEME_NAME_KEY, DEFAULT_THEME),
      themeMode: stateManager.get(THEME_MODE_KEY, DEFAULT_MODE)
    }),

    /**
     * Toggle between light and dark mode
     * @param {Object} button - Button component (optional)
     * @returns {boolean} Whether dark mode is now active
     */
    toggleDarkMode: (button) => {
      const currentMode = stateManager.get(THEME_MODE_KEY, DEFAULT_MODE)
      const isDarkMode = currentMode !== 'dark'
      const newMode = isDarkMode ? 'dark' : 'light'

      // Set new mode
      document.body.setAttribute('data-theme-mode', newMode)
      stateManager.set(THEME_MODE_KEY, newMode)

      // Update button icon if provided
      if (button && typeof button.setIcon === 'function') {
        button.setIcon(isDarkMode ? LIGHT_MODE_ICON : DARK_MODE_ICON)
      }

      // Trigger event
      trigger(EVENTS.MODE_CHANGE, newMode)

      return isDarkMode
    },

    /**
     * Set theme
     * @param {string} themeName - Theme name
     * @returns {string} Applied theme name
     */
    setTheme: (themeName) => {
      const name = themeName || DEFAULT_THEME

      document.body.setAttribute('data-theme', name)
      stateManager.set(THEME_NAME_KEY, name)

      // Trigger event
      trigger(EVENTS.THEME_CHANGE, name)

      return name
    },

    /**
     * Get the appropriate icon for current mode
     * @returns {string} SVG icon string
     */
    getThemeModeIcon: () => {
      const currentMode = stateManager.get(THEME_MODE_KEY, DEFAULT_MODE)
      return currentMode === 'dark' ? LIGHT_MODE_ICON : DARK_MODE_ICON
    },

    // Event handling
    on,
    off,

    // Constants
    EVENTS,
    DARK_MODE_ICON,
    LIGHT_MODE_ICON
  }
}

// Create singleton instance
const themeService = createThemeService()
export default themeService
