import { fLayout, fChips, fSwitch } from 'mtrl'
import { createContentSection } from '../../../layout/content'
import themeManager from '../../../core/theme/theme-manager'

export const createColorPalettes = (container) => {
  // Create main layout with content section
  const layout = fLayout(createContentSection({
    title: 'Theme Colors',
    description: 'Theme colors provide semantic meaning and are used consistently across components.',
    class: 'color-palettes'
  }), container).getAll()

  const body = layout.body

  // Define themes with their colors
  const themes = ['ocean', 'forest', 'material', 'spring', 'summer', 'autumn', 'winter']

  // Get current theme settings
  const currentSettings = themeManager.getSettings()

  // Create a layout with separate containers for controls and palettes
  const mainLayout = fLayout([
    ['controlsContainer', { class: 'theme-controls-container' },
      [fChips, 'themeChipSet', {
        scrollable: true,
        multiSelect: true, // Enable multiple selection
        class: 'theme-chip-set',
        label: 'Select Theme'
      }],
      [fSwitch, 'darkModeSwitch', {
        label: 'Dark Mode',
        checked: currentSettings.themeMode === 'dark',
        class: 'dark-mode-switch'
      }]
    ],
    ['palettesContainer', { class: 'color-palettes-container' }]
  ], body)

  // Extract components
  const { themeChipSet, darkModeSwitch, palettesContainer } = mainLayout.component

  // Store current theme to prevent infinite event loops
  let isProcessingThemeChange = false
  let lastSelectedTheme = currentSettings.themeName || 'material'
  let lastThemeMode = currentSettings.themeMode || 'light'

  // Handle theme changes from chip selection
  themeChipSet.on('change', (selectedValues) => {
    console.log('themeChipSet change', selectedValues)

    // If we're already processing a theme change, don't trigger another one
    if (isProcessingThemeChange) return

    // In multi-select mode, we need to handle multiple selections
    if (selectedValues.length > 0) {
      // Get the primary theme - for simplicity, we'll use the first selected value
      // In a real implementation, you might want to combine themes or handle them differently
      const primaryTheme = selectedValues[0]

      // Prevent update loop by checking if the theme actually changed
      if (primaryTheme !== lastSelectedTheme) {
        lastSelectedTheme = primaryTheme

        // Set flag to prevent event loops
        isProcessingThemeChange = true

        // Use themeManager to set the theme but maintain the current mode
        themeManager.setTheme(primaryTheme, lastThemeMode)

        // Reset flag after a short delay to allow other events to finish
        setTimeout(() => {
          isProcessingThemeChange = false
        }, 50)
      }
    }
  })

  // Handle dark mode toggle
  darkModeSwitch.on('change', () => {
    // If we're already processing a theme change, don't trigger another one
    if (isProcessingThemeChange) return

    const newMode = darkModeSwitch.isChecked() ? 'dark' : 'light'

    // Prevent update loop by checking if the mode actually changed
    if (newMode !== lastThemeMode) {
      lastThemeMode = newMode

      // Set flag to prevent event loops
      isProcessingThemeChange = true

      // Use themeManager to set the theme mode but maintain the current theme
      themeManager.setThemeMode(newMode)

      // Reset flag after a short delay to allow other events to finish
      setTimeout(() => {
        isProcessingThemeChange = false
      }, 50)
    }
  })

  // Add chips to chip set
  for (let i = 0; i < themes.length; i++) {
    const name = themes[i]
    themeChipSet.addChip({
      text: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
      value: name,
      variant: 'filter',
      selectable: true, // Explicitly make it selectable
      selected: name === lastSelectedTheme, // Pre-select current theme
      class: `theme-chip theme-${name}`,
      // Handle individual chip selection changes (if needed)
      onChange: (isSelected, chip) => {
        console.log(`Chip ${chip.getText()} is now ${isSelected ? 'selected' : 'deselected'}`)
      }
    })
  }

  // Force theme to be saved in both storage systems to keep them in sync
  // This ensures the theme is remembered after page reload
  themeManager.setTheme(lastSelectedTheme, lastThemeMode)

  // Listen for theme changes from elsewhere in the app
  window.addEventListener('themechange', (event) => {
    console.log('themechange', event)

    // Only process if we're not already handling a change
    if (isProcessingThemeChange) return

    // Set flag to prevent event loops
    isProcessingThemeChange = true

    // Update tracking variables and UI for theme name if changed
    if (event.detail.themeName && event.detail.themeName !== lastSelectedTheme) {
      lastSelectedTheme = event.detail.themeName

      // For multi-select, we need to be careful not to clear other selections
      // Pass false to prevent triggering another change event
      themeChipSet.selectByValue(event.detail.themeName, false)
    }

    // Update tracking variables and UI for theme mode if changed
    if (event.detail.themeMode && event.detail.themeMode !== lastThemeMode) {
      lastThemeMode = event.detail.themeMode
      // Update the switch without triggering cascading events
      const isDark = event.detail.themeMode === 'dark'
      darkModeSwitch.setChecked(isDark, false)
    }

    // Reset the flag after a short delay
    setTimeout(() => {
      isProcessingThemeChange = false
    }, 50)
  })

  // Create palette layouts
  const tones = [10, 30, 50, 70, 90]

  const palettes = [
    { name: 'primary', label: 'Primary', tones },
    { name: 'secondary', label: 'Secondary', tones },
    { name: 'tertiary', label: 'Tertiary', tones },
    { name: 'error', label: 'Error', tones }
  ]

  // Create each palette using fLayout
  palettes.forEach(palette => {
    // Define the structure of the palette layout
    const paletteStructure = [
      ['palette', { class: 'color-palette' },
        ['title', { tag: 'h3', class: 'color-palette__title', text: palette.label }]
      ]
    ]

    // Create the palette layout
    const paletteLayout = fLayout(paletteStructure, palettesContainer)
    const paletteElement = paletteLayout.get('palette')

    // Create swatches for each tone using fLayout
    palette.tones.forEach(tone => {
      // Determine color value based on tone
      let backgroundColor, variableName

      if (tone === 50) {
        backgroundColor = `var(--mtrl-sys-color-${palette.name})`
        variableName = `var(--mtrl-sys-color-${palette.name})`
      } else if (tone < 50) {
        // For lighter tones
        backgroundColor = `color-mix(in srgb, var(--mtrl-sys-color-${palette.name}) ${tone * 2}%, var(--mtrl-sys-color-surface))`
        variableName = `${palette.name}-${tone}`
      } else {
        // For darker tones
        backgroundColor = `color-mix(in srgb, var(--mtrl-sys-color-${palette.name}) ${100 - (tone - 50)}%, var(--mtrl-sys-color-on-surface))`
        variableName = `${palette.name}-${tone}`
      }

      // Determine text color based on tone for better contrast
      const textColor = tone < 50 ? 'var(--mtrl-sys-color-on-surface)' : 'var(--mtrl-sys-color-surface)'

      // Create the swatch layout
      fLayout([
        ['swatch', { tag: 'div', class: 'color-swatch', style: `background-color: ${backgroundColor};` },
          ['tone', { tag: 'div', class: 'color-swatch__tone', text: `${palette.name}-${tone}`, style: `color: ${textColor};` }],
          ['value', { tag: 'div', class: 'color-swatch__value', text: variableName, style: `color: ${textColor};` }]
        ]
      ], paletteElement)
    })
  })
}
