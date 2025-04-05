import {
  createLayout,
  fChipSet,
  fSwitch
} from 'mtrl'

import { createContentSection } from '../../../layout/content'
import themeManager from '../../../core/theme/theme-manager'

export const createColorPalettes = (container) => {
  // Create main layout with content section
  const layout = createLayout(createContentSection({
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
  const mainLayout = createLayout([
    // Theme Controls Container
    ['controlsContainer', { class: 'theme-controls-container' },
      [fChipSet, 'themeChipSet', {
        scrollable: true,
        multiSelect: false,
        class: 'theme-chip-set'
      }],
      [fSwitch, 'darkModeSwitch', {
        label: 'Dark Mode',
        checked: currentSettings.themeMode === 'dark'
      }]
    ],

    // Palettes Container (separate from controls, but in same section)
    ['palettesContainer', { class: 'color-palettes-container' }]
  ], body)

  // Extract components
  const { themeChipSet, darkModeSwitch, palettesContainer } = mainLayout.component

  // Add chips to chip set
  for (let i = themes.length - 1; i >= 0; i--) {
    const name = themes[i]
    themeChipSet.addChip({
      text: name,
      value: name,
      variant: 'filter',
      selectable: true, // Explicitly make it selectable
      selected: name === currentSettings.themeName, // Pre-select current theme
      class: `theme-chip theme-${name}`,
      // Add per-chip change handler
      onChange: (chip) => {
        // console.log('chip', chip)
        chip.addClass('mtrl-chip--selected')
      }
    })
  }

  // Force theme to be saved in both storage systems to keep them in sync
  // This ensures the theme is remembered after page reload
  const currentTheme = currentSettings.themeName || 'material'
  themeManager.setTheme(currentTheme)

  // We'll select the theme chip after all chips are initialized

  // Store current theme to prevent infinite event loops
  let lastSelectedTheme = currentTheme

  // Handle theme changes from chip selection
  themeChipSet.on('change', (selectedValues) => {
    if (selectedValues.length > 0) {
      const theme = selectedValues[0]

      // Prevent update loop by checking if the theme actually changed
      if (theme !== lastSelectedTheme) {
        lastSelectedTheme = theme
        // Use themeManager to set the theme
        themeManager.setTheme(theme)
      }
    }
  })

  // Handle dark mode toggle
  darkModeSwitch.on('change', () => {
    const newMode = darkModeSwitch.isChecked() ? 'dark' : 'light'
    themeManager.setThemeMode(newMode)
  })

  // Listen for theme changes from elsewhere in the app
  window.addEventListener('themechange', (event) => {
    // Update switch state if theme mode changed elsewhere
    const currentSwitchMode = darkModeSwitch.isChecked() ? 'dark' : 'light'
    if (event.detail.themeMode !== currentSwitchMode) {
      // Use the correct method for the Switch component
      if (event.detail.themeMode === 'dark') {
        darkModeSwitch.check()
      } else {
        darkModeSwitch.uncheck()
      }
    }

    // Update chip selection if theme changed elsewhere
    if (event.detail.themeName && event.detail.themeName !== lastSelectedTheme) {
      // Update our tracking variable
      lastSelectedTheme = event.detail.themeName
      // Update the UI without triggering another change event
      themeChipSet.selectByValue(event.detail.themeName)
    }
  })

  // Just select the current theme - icon update is handled by each chip's onChange
  themeChipSet.selectByValue(currentTheme)

  // Create palette layouts
  const palettes = [
    { name: 'primary', label: 'Primary', tones: [10, 30, 50, 70, 90] },
    { name: 'secondary', label: 'Secondary', tones: [10, 30, 50, 70, 90] },
    { name: 'tertiary', label: 'Tertiary', tones: [10, 30, 50, 70, 90] },
    { name: 'error', label: 'Error', tones: [10, 30, 50, 70, 90] }
  ]

  // Create each palette using createLayout
  palettes.forEach(palette => {
    // Define the structure of the palette layout
    const paletteStructure = [
      ['palette', { class: 'color-palette' },
        ['title', { tag: 'h3', class: 'color-palette__title', text: palette.label }]
      ]
    ]

    // console.log('palettesContainer', palettesContainer)

    // Create the palette layout
    const paletteLayout = createLayout(paletteStructure, palettesContainer)
    const paletteElement = paletteLayout.get('palette')

    // Create swatches for each tone using createLayout
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
      const swatchLayout = createLayout([
        ['swatch', {
          tag: 'div',
          class: 'color-swatch',
          style: `background-color: ${backgroundColor};`
        },
        ['tone', {
          tag: 'div',
          class: 'color-swatch__tone',
          text: `${palette.name}-${tone}`,
          style: `color: ${textColor};`
        }],
        ['value', {
          tag: 'div',
          class: 'color-swatch__value',
          text: variableName,
          style: `color: ${textColor};`
        }]
        ]
      ], paletteElement)
    })
  })
}
