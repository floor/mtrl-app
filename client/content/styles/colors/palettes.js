import {
  createLayout,
  createChipSet,
  createSwitch
} from 'mtrl'

import { createContentSection } from '../../../layout/content'

export const createColorPalettes = (container) => {
  // Create main layout with content section
  const layout = createLayout(createContentSection({
    title: 'Theme Colors',
    description: 'Theme colors provide semantic meaning and are used consistently across components. Use these tokens to maintain visual consistency and accessibility.',
    class: 'color-palettes'
  }), container).getAll()

  const body = layout.body
  const themeTitle = layout.title

  // Define themes with their colors
  const themes = ['ocean', 'forest', 'sunset', 'material', 'spring', 'summer', 'autumn', 'winter']

  // Create a layout with separate containers for controls and palettes
  const mainLayout = createLayout([
    // Theme Controls Container
    ['controlsContainer', { class: 'theme-controls-container' },
      [createChipSet, 'themeChipSet', {
        scrollable: true,
        multiSelect: false,
        class: 'theme-chip-set'
      }]
      // [createSwitch, 'darkModeSwitch', {
      //   label: 'Dark Mode',
      //   checked: document.body.getAttribute('data-theme-mode') === 'dark'
      // }]
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
      class: `theme-chip theme-${name}`
    })
  }

  // Handle theme changes
  themeChipSet.on('change', (selectedChips) => {
    if (selectedChips.length > 0) {
      console.log('selectedChips', selectedChips[0])
      const theme = selectedChips[0]

      console.log('theme', theme)

      // Apply theme to the document body
      document.body.setAttribute('data-theme', theme)

      // // Update theme title
      // themeTitle.textContent = `Theme Colors (${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} Theme)`

      // Update chip colors
      // updateChipColors(themeChipSet, themes)
    }
  })

  // Handle dark mode toggle
  // darkModeSwitch.on('change', () => {
  //   const newMode = darkModeSwitch.isChecked() ? 'dark' : 'light'
  //   document.body.setAttribute('data-theme-mode', newMode)
  // })

  // Add CSS for styling
  // addThemeStyles()

  // Update chip colors initially
  updateChipColors(themeChipSet, themes)

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

    console.log('palettesContainer', palettesContainer)

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

/**
 * Updates chip colors based on selection state
 */
function updateChipColors (chipSet, themes) {
  const allChips = chipSet.getChips()

  allChips.forEach(chip => {
    const chipValue = chip.getValue()
    const theme = themes.find(t => t.name === chipValue)

    if (theme) {
      if (chip.isSelected()) {
        // Apply selected colors
        chip.element.style.backgroundColor = theme.selectedBackgroundColor
        chip.element.style.color = theme.selectedTextColor
        chip.element.style.borderColor = theme.selectedBackgroundColor
      } else {
        // Apply unselected colors
        chip.element.style.backgroundColor = theme.backgroundColor
        chip.element.style.color = '' // Reset to default text color
        chip.element.style.borderColor = '' // Reset to default border
      }
    }
  })
}
