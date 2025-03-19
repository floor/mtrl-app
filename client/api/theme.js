// src/client/api/theme.js
import themeService from '../core/theme'

/**
 * Provides a simplified API for theme management in components
 */
export const themeAPI = {
  /**
   * Initialize theme from saved preferences
   * @returns {Object} Current theme settings
   */
  init: () => themeService.init(),

  /**
   * Get current theme settings
   * @returns {Object} Current theme settings
   */
  getSettings: () => themeService.getSettings(),

  /**
   * Toggle between light and dark mode
   * @param {Object} button - Optional button component to update icon
   * @returns {boolean} Whether dark mode is now active
   */
  toggleDarkMode: (button) => themeService.toggleDarkMode(button),

  /**
   * Set active theme
   * @param {string} themeName - Theme name to set
   * @returns {string} Applied theme name
   */
  setTheme: (themeName) => themeService.setTheme(themeName),

  /**
   * Check if dark mode is active
   * @returns {boolean} Whether dark mode is active
   */
  isDarkMode: () => themeService.getSettings().themeMode === 'dark',

  /**
   * Get current theme name
   * @returns {string} Current theme name
   */
  getThemeName: () => themeService.getSettings().themeName,

  /**
   * Register event listener for theme changes
   * @param {Function} callback - Function to call when theme changes
   * @returns {Function} Cleanup function
   */
  onThemeChange: (callback) => themeService.on(themeService.EVENTS.THEME_CHANGE, callback),

  /**
   * Register event listener for mode changes
   * @param {Function} callback - Function to call when mode changes
   * @returns {Function} Cleanup function
   */
  onModeChange: (callback) => themeService.on(themeService.EVENTS.MODE_CHANGE, callback),

  /**
   * Available theme names (from config)
   */
  THEMES: ['ocean', 'forest', 'sunset', 'spring', 'summer', 'autumn', 'winter']
}

export default themeAPI
