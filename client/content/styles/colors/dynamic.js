import {
  createLayout,
  createElement,
  createChips,
  createSwitch
} from 'mtrl'
import { createContentSection } from '../../../layout'

export const createDynamicTheme = (container) => {
  console.log('createDynamicTheme', container)
  const layout = createLayout(createContentSection({
    title: 'Theme',
    description: 'Try different themes to see how color tokens adapt to maintain consistency across themes and color modes.',
    class: 'theme-colors'
  }), container).getAll()

  const body = layout.body
  console.log('body', body)

  const themeTitle = layout.title

  // Show theme color samples
  const themeColorChips = createElement({
    tag: 'div',
    class: 'theme-color-chips'
  })

  // Theme switchers container
  const themeSwitchers = createElement({
    tag: 'div',
    class: 'theme-switchers'
  })

  // Dark mode controls container
  const darkModeContainer = createElement({
    tag: 'div',
    class: 'dark-mode-container'
  })

  const themes = [
    { name: 'ocean', label: 'Ocean Theme', selected: true },
    { name: 'forest', label: 'Forest Theme' },
    { name: 'sunset', label: 'Sunset Theme' },
    { name: 'material', label: 'Material Theme' },
    { name: 'spring', label: 'Spring Theme' },
    { name: 'summer', label: 'Summer Theme' },
    { name: 'autumn', label: 'Autumn Theme' },
    { name: 'winter', label: 'Winter Theme' }
  ]

  // Create a chip set for theme selection
  const themeChips = createChips({
    scrollable: true,
    multiSelect: false, // Only one theme can be active at a time
    onChange: (selectedChip, selectedChips) => {
      // Check if we have a selected chip and use it directly
      if (selectedChip) {
        const selectedTheme = selectedChip.getValue()

        // Add additional fallback if getValue returns null
        if (selectedTheme) {
          // Apply theme to the document body
          document.body.setAttribute('data-theme', selectedTheme)

          // Update theme title
          themeTitle.textContent = `Theme: ${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}`
        } else {
          console.warn('Selected chip has no value')
        }
      } else if (selectedChips && selectedChips.length > 0) {
        // Fallback to the original approach
        const selectedTheme = selectedChips[0].getValue()

        if (selectedTheme) {
          // Apply theme to the document body
          document.body.setAttribute('data-theme', selectedTheme)

          // Update theme title
          themeTitle.textContent = `Theme: ${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}`
        }
      }
    }
  })

  console.log('themeChip', themeChips)

  // Create and add chips for each theme
  themes.forEach(theme => {
    themeChips.addChip({
      text: theme.label,
      value: theme.name, // Make sure this value is being set correctly
      variant: 'filter', // Filter chip variant works well for selections
      selected: theme.name === 'ocean', // Default to ocean theme
      class: `theme-chip theme-${theme.name}`
    })
  })

  // Add the chip set element to the theme switchers container
  themeSwitchers.appendChild(themeChips.element)

  // Create dark mode switch
  const darkModeSwitch = createSwitch({
    label: 'Dark Mode',
    checked: document.body.getAttribute('data-theme-mode') === 'dark',
    supportingText: 'Toggle between light and dark mode'
  })

  // Handle dark mode toggle
  darkModeSwitch.on('change', () => {
    const newMode = darkModeSwitch.isChecked() ? 'dark' : 'light'
    document.body.setAttribute('data-theme-mode', newMode)
  })

  // Add dark mode switch to container
  darkModeContainer.appendChild(darkModeSwitch.element)
  themeSwitchers.appendChild(darkModeContainer)

  body.appendChild(themeColorChips)
  body.appendChild(themeSwitchers)
}
