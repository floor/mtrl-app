// src/client/core/theme/theme-manager.js

import { createMenu } from 'mtrl'
import stateManager from '../state'
import { darkIcon, lightIcon } from '../../icons/'

/**
 * Creates a theme manager for handling application theming and dark mode
 * @param {Object} options - Configuration options
 * @returns {Object} Theme manager API
 */
export const createThemeManager = (options = {}) => {
  // Configuration with defaults
  const config = {
    stateKey: 'theme-settings',
    defaultTheme: 'ocean',
    defaultMode: 'light',
    systemPreference: true,
    transitionDuration: 300,
    themeAttribute: 'data-theme',
    modeAttribute: 'data-theme-mode',
    modeToggleIcons: {
      light: lightIcon,
      dark: darkIcon
    },
    ...options
  }

  // UI references
  let ui = options.ui || null
  let themesMenu = null

  // State storage
  const themeSettings = stateManager.get(config.stateKey, {
    themeName: config.defaultTheme,
    themeMode: config.defaultMode,
    useSystemPreference: config.systemPreference
  })

  // System preference media query
  const prefersDarkMedia = window.matchMedia('(prefers-color-scheme: dark)')

  // Private methods

  /**
   * Apply the current theme settings to the document
   * @private
   */
  const applyTheme = () => {
    // Add theme classes to document body
    document.body.setAttribute(config.themeAttribute, themeSettings.themeName)
    document.body.setAttribute(config.modeAttribute, themeSettings.themeMode)

    // For backwards compatibility, also set data attributes directly
    document.body.setAttribute('data-theme', themeSettings.themeName)
    document.body.setAttribute('data-theme-mode', themeSettings.themeMode)

    // Add animation blocker temporarily to prevent transition flicker on load
    const style = document.createElement('style')
    style.id = 'theme-transition-blocker'
    style.textContent = '*, *::before, *::after { transition: none !important; }'
    document.head.appendChild(style)

    // Remove the transition blocker after a short delay
    setTimeout(() => {
      const blocker = document.getElementById('theme-transition-blocker')
      if (blocker) {
        blocker.remove()
      }
    }, 50)

    // Update any UI components that reflect theme state
    if (ui && ui.toggleDarkmode) {
      ui.toggleDarkmode.setIcon(getThemeModeIcon())
    }

    // Dispatch theme change event
    dispatchThemeEvent()
  }

  /**
   * Initialize theme-related UI elements
   * @private
   */
  const initializeUI = () => {
    // Set up dark mode toggle
    if (ui.toggleDarkmode) {
      // Set initial icon
      if (ui.toggleDarkmode.setIcon) {
        ui.toggleDarkmode.setIcon(getThemeModeIcon())
      }

      // Set up click handler
      if (ui.toggleDarkmode.on) {
        ui.toggleDarkmode.on('click', () => {
          toggleDarkMode(ui.toggleDarkmode)
        })
      } else {
        // Alternative approach for components without 'on' method
        const toggleElement = ui.toggleDarkmode.element || ui.toggleDarkmode
        if (toggleElement && toggleElement.addEventListener) {
          toggleElement.addEventListener('click', () => {
            toggleDarkMode(ui.toggleDarkmode)
          })
        }
      }
    }

    // Set up theme menu
    if ((ui.moreMenu?.on || ui.moreMenu?.element) && config.themesMenu) {
      initializeThemeMenu()
    }
  }

  /**
   * Initialize theme selection menu
   * @private
   */
  const initializeThemeMenu = () => {
    // Create the menu once and attach it to the anchor
    if (!themesMenu && ui.moreMenu?.element) {
      themesMenu = createMenu({
        items: config.themesMenu,
        opener: ui.moreMenu.element
      })

      // Set up the menu selection handler
      themesMenu.on('select', (event) => {
        // Apply theme change
        setTheme(event.itemId)

        // Let the menu close gracefully with its built-in animation
        // The closeOnSelect: false option in menu creation prevents immediate closing
      })

      // Set the currently selected theme if the menu supports it
      if (themesMenu.setSelected && themeSettings.themeName) {
        themesMenu.setSelected(themeSettings.themeName)
      }
    }
  }

  /**
   * Handle system preference changes
   * @param {MediaQueryListEvent} event - Media query change event
   * @private
   */
  const handleSystemPreferenceChange = (event) => {
    if (themeSettings.useSystemPreference) {
      const newMode = event.matches ? 'dark' : 'light'
      setThemeMode(newMode, true)
    }
  }

  /**
   * Apply the system color scheme preference
   * @private
   */
  const applySystemPreference = () => {
    const prefersDark = prefersDarkMedia.matches
    const newMode = prefersDark ? 'dark' : 'light'

    // Only update if different from current
    if (themeSettings.themeMode !== newMode) {
      setThemeMode(newMode, true)
    }
  }

  /**
   * Set up listener for system preference changes
   * @private
   */
  const setupSystemPreferenceListener = () => {
    // Remove existing listener if any
    prefersDarkMedia.removeEventListener('change', handleSystemPreferenceChange)

    // Add new listener
    prefersDarkMedia.addEventListener('change', handleSystemPreferenceChange)

    // Apply initial system preference
    if (themeSettings.useSystemPreference) {
      applySystemPreference()
    }
  }

  /**
   * Save current theme settings to persistent storage
   * @private
   */
  const saveSettings = () => {
    stateManager.set(config.stateKey, themeSettings)
  }

  /**
   * Dispatch theme change event
   * @private
   */
  const dispatchThemeEvent = () => {
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: {
        ...themeSettings,
        timestamp: Date.now()
      }
    }))
  }

  // Public API methods

  /**
   * Initialize the theme system
   */
  const initialize = () => {
    // Apply initial theme
    applyTheme()

    // Set up system preference listener
    if (themeSettings.useSystemPreference) {
      setupSystemPreferenceListener()
    }

    // Initialize UI elements if available
    if (ui) {
      initializeUI()
    }

    return themeManager
  }

  /**
   * Set the theme
   * @param {string} themeName - Theme name
   * @returns {Object} Theme manager for chaining
   */
  const setTheme = (themeName) => {
    if (!themeName) return themeManager

    // Update theme name
    themeSettings.themeName = themeName

    // Update selected theme in menu
    if (themesMenu?.setSelected) {
      themesMenu.setSelected(themeName)
    }

    // Apply theme
    applyTheme()

    // Save settings
    saveSettings()

    return themeManager
  }

  /**
   * Set the theme mode (light/dark)
   * @param {string} mode - Theme mode ('light' or 'dark')
   * @param {boolean} system - Whether change is from system preference
   * @returns {Object} Theme manager for chaining
   */
  const setThemeMode = (mode, system = false) => {
    // Validate mode
    if (mode !== 'light' && mode !== 'dark') return themeManager

    // Update settings
    themeSettings.themeMode = mode

    // If manually set, update system preference setting
    if (!system) {
      themeSettings.useSystemPreference = false
    }

    // Apply theme
    applyTheme()

    // Update UI if available
    if (ui?.toggleDarkmode?.setIcon) {
      ui.toggleDarkmode.setIcon(getThemeModeIcon())
    }

    // Save settings
    saveSettings()

    return themeManager
  }

  /**
   * Toggle between light and dark mode
   * @param {Object} button - Toggle button component (optional)
   * @returns {string} New theme mode
   */
  const toggleDarkMode = (button = null) => {
    // Determine new mode
    const currentMode = themeSettings.themeMode
    const newMode = currentMode === 'dark' ? 'light' : 'dark'

    // Set new mode
    setThemeMode(newMode)

    // Update button icon if provided
    if (button) {
      button.setIcon(getThemeModeIcon())
    }

    return newMode
  }

  /**
   * Use system preference for theme mode
   * @returns {Object} Theme manager for chaining
   */
  const useSystemPreference = () => {
    // Update setting
    themeSettings.useSystemPreference = true

    // Apply system preference
    setupSystemPreferenceListener()
    applySystemPreference()

    // Save settings
    saveSettings()

    return themeManager
  }

  /**
   * Get the icon name for the current theme mode
   * @returns {string} Icon name
   */
  const getThemeModeIcon = () => {
    const currentMode = themeSettings.themeMode
    return config.modeToggleIcons[currentMode] || 'brightness_medium'
  }

  /**
   * Get current theme settings
   * @returns {Object} Theme settings
   */
  const getSettings = () => {
    return { ...themeSettings }
  }

  /**
   * Clean up theme manager resources
   */
  const cleanup = () => {
    // Remove system preference listener
    prefersDarkMedia.removeEventListener('change', handleSystemPreferenceChange)

    // Destroy theme menu if exists
    if (themesMenu) {
      themesMenu.destroy()
      themesMenu = null
    }
  }

  /**
   * Update configuration options
   * @param {Object} newOptions - New configuration options
   */
  const configure = (newOptions) => {
    Object.assign(config, newOptions)

    // Update UI reference if provided
    if (newOptions.ui) {
      ui = newOptions.ui
    }

    return themeManager
  }

  // Create the API object
  const themeManager = {
    initialize,
    getSettings,
    setTheme,
    setThemeMode,
    toggleDarkMode,
    useSystemPreference,
    getThemeModeIcon,
    cleanup,
    configure
  }

  return themeManager
}

// Create and export a singleton instance
const themeManager = createThemeManager()

// Add a direct toggle function for the singleton
// This can be used directly from the window context for debugging
themeManager.toggleDarkModeGlobal = () => {
  return themeManager.toggleDarkMode()
}

// Expose as global for debugging and direct access if needed
if (typeof window !== 'undefined') {
  window.themeManager = themeManager
}

export default themeManager
