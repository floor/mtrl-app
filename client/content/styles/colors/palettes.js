import { fLayout, fChips, fChip } from 'mtrl'
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
  const themes = ['ocean', 'forest', 'spring', 'summer', 'autumn', 'winter', 'material']

  // Get current theme settings
  const currentSettings = themeManager.getSettings()

  // Create a layout with separate containers for controls and palettes
  const mainLayout = fLayout([
    ['controlsContainer', { class: 'theme-controls-container' },
      [fChips, 'themeChipSet', {
        scrollable: false,
        multiSelect: false, // Enable multiple selection
        class: 'theme-chip-set',
        label: 'Select Theme',
        onChange: (values) => {
          themeChangeHandler(values[0])
        }
      }],
      [fChip, 'darkModeChip', {
        text: 'Dark Mode',
        variant: 'filter', // Add a variant that supports selection
        selectable: true, // Explicitly make it selectable
        selected: currentSettings.themeMode === 'dark',
        class: 'dark-mode-chip',
        onChange: (isSelected, chip) => { // Use onChange instead of onSelect
          darkmodeChangeHandler(isSelected) // Pass the boolean selection state
        }
      }]
    ],
    ['palettesContainer', { class: 'color-palettes-container' }]
  ], body)

  // Extract components
  const { themeChipSet, darkModeChip, palettesContainer } = mainLayout.component

  // Store current theme to prevent infinite event loops
  let lastSelectedTheme = currentSettings.themeName || 'material'
  let lastThemeMode = currentSettings.themeMode || 'light'

  const themeChangeHandler = (theme) => {
    if (!theme) return

    // Prevent update loop by checking if the theme actually changed
    if (theme !== lastSelectedTheme) {
      lastSelectedTheme = theme

      // Use themeManager to set the theme but maintain the current mode
      themeManager.setTheme(theme, lastThemeMode)
    }
  }

  const darkmodeChangeHandler = (isSelected) => {
    // console.log('darkmodeChangeHandler', isSelected)

    const newMode = isSelected ? 'dark' : 'light'

    // Prevent update loop by checking if the mode actually changed
    if (newMode !== lastThemeMode) {
      lastThemeMode = newMode

      // Use themeManager to set the theme mode but maintain the current theme
      themeManager.setThemeMode(newMode)
    }
  }

  // Add chips to chip set
  for (let i = 0; i < themes.length; i++) {
    const name = themes[i]
    themeChipSet.addChip({
      text: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
      value: name,
      variant: 'filter',
      selectable: true, // Explicitly make it selectable
      selected: name === lastSelectedTheme, // Pre-select current theme
      class: `theme-chip theme-${name}`
    })
  }

  // Force theme to be saved in both storage systems to keep them in sync
  // This ensures the theme is remembered after page reload
  themeManager.setTheme(lastSelectedTheme, lastThemeMode)

  // Listen for theme changes from elsewhere in the app
  window.addEventListener('themechange', (event) => {
    // console.log('themechange', event)

    // Update tracking variables and UI for theme name if changed
    if (event.detail.themeName && event.detail.themeName !== lastSelectedTheme) {
      lastSelectedTheme = event.detail.themeName

      themeChipSet.selectByValue(event.detail.themeName, false)
    }

    if (event.detail.themeMode && event.detail.themeMode !== lastThemeMode) {
      lastThemeMode = event.detail.themeMode
      // Update the switch without triggering cascading events
      const isDark = event.detail.themeMode === 'dark'
      darkModeChip.setSelected(isDark)
    }
  })

  // Create palette layouts
  const tones = [10, 30, 50, 70, 90]
  // const tones = [90, 70, 50, 30, 10]

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
