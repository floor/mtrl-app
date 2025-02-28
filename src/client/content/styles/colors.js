// src/client/content/styles/colors.js

import {
  contentLayout
} from '../../config'

import {
  createLayout,
  createElement,
  createButton
} from 'mtrl'

export const createColorsContent = (container) => {
  const info = {
    title: 'Colors',
    description: 'The color system helps create a consistent look across your UI'
  }
  const layout = createLayout(contentLayout(info), container).component

  const ui = createLayout(createColorsLayout(), layout.body).component

  initColorPalettes(ui)
  initThemeColors(ui)
  initColorState(ui)
  initDynamicTheme(ui)
}

export const initColorPalettes = (ui) => {
  const container = ui.palettes

  // Create color swatches for primary and secondary palettes
  const palettes = [
    { name: 'primary', label: 'Primary', tones: [10, 30, 50, 70, 90] },
    { name: 'secondary', label: 'Secondary', tones: [10, 30, 50, 70, 90] },
    { name: 'tertiary', label: 'Tertiary', tones: [10, 30, 50, 70, 90] },
    { name: 'error', label: 'Error', tones: [10, 30, 50, 70, 90] }
  ]

  palettes.forEach(palette => {
    // Create a palette container
    const colorPalette = createElement({
      tag: 'div',
      class: 'color-palette'
    })

    // Add palette title
    const paletteTitle = createElement({
      tag: 'h3',
      class: 'color-palette__title',
      text: palette.label
    })
    colorPalette.appendChild(paletteTitle)

    // Create swatches for each tone
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

      const swatch = createElement({
        tag: 'div',
        class: 'color-swatch',
        style: `background-color: ${backgroundColor};`
      })

      // Add tone label with better contrast
      const toneName = createElement({
        tag: 'div',
        class: 'color-swatch__tone',
        text: `${palette.name}-${tone}`
      })

      // Determine text color based on tone for better contrast
      const textColor = tone < 50 ? 'var(--mtrl-sys-color-on-surface)' : 'var(--mtrl-sys-color-surface)'
      toneName.style.color = textColor

      // Add abbreviated color value for cleaner display
      const toneValue = createElement({
        tag: 'div',
        class: 'color-swatch__value',
        text: variableName
      })
      toneValue.style.color = textColor

      swatch.appendChild(toneName)
      swatch.appendChild(toneValue)
      colorPalette.appendChild(swatch)
    })

    container.appendChild(colorPalette)
  })
}

export const initThemeColors = (ui) => {
  const container = ui.themeColors

  // Create semantic color tokens
  const semanticColors = [
    { name: 'primary', label: 'Primary' },
    { name: 'on-primary', label: 'On Primary' },
    { name: 'secondary', label: 'Secondary' },
    { name: 'on-secondary', label: 'On Secondary' },
    { name: 'tertiary', label: 'Tertiary' },
    { name: 'on-tertiary', label: 'On Tertiary' },
    { name: 'error', label: 'Error' },
    { name: 'on-error', label: 'On Error' },
    { name: 'surface', label: 'Surface' },
    { name: 'on-surface', label: 'On Surface' },
    { name: 'surface-container', label: 'Surface Container' },
    { name: 'outline', label: 'Outline' }
  ]

  // Create container for theme colors
  const themeColorsGrid = createElement({
    tag: 'div',
    class: 'color-theme-grid'
  })

  semanticColors.forEach(color => {
    // Create a color box with the semantic color
    const colorSwatch = createElement({
      tag: 'div',
      class: 'theme-color-swatch',
      style: `background-color: var(--mtrl-sys-color-${color.name});`
    })

    // Create color info container
    const colorInfo = createElement({
      tag: 'div',
      class: 'theme-color__info'
    })

    // Color label
    const colorLabel = createElement({
      tag: 'span',
      class: 'theme-color__label',
      text: color.label
    })

    // Color value
    const colorValue = createElement({
      tag: 'span',
      class: 'theme-color__value',
      text: `var(--mtrl-sys-color-${color.name})`
    })

    // Determine appropriate text color
    let textColor
    if (color.name.startsWith('on-')) {
      const baseColor = color.name.substring(3)
      colorSwatch.style.backgroundColor = `var(--mtrl-sys-color-${baseColor})`
      textColor = `var(--mtrl-sys-color-${color.name})`
    } else {
      const hasMatchingOnColor = semanticColors.some(c => c.name === `on-${color.name}`)
      if (hasMatchingOnColor) {
        textColor = `var(--mtrl-sys-color-on-${color.name})`
      } else {
        textColor = color.name === 'surface' || color.name === 'surface-container' ? 'var(--mtrl-sys-color-on-surface)' : '#fff'
      }
    }

    colorLabel.style.color = textColor
    colorValue.style.color = textColor

    colorInfo.appendChild(colorLabel)
    colorInfo.appendChild(colorValue)
    colorSwatch.appendChild(colorInfo)
    themeColorsGrid.appendChild(colorSwatch)
  })

  container.appendChild(themeColorsGrid)
}

export const initColorState = (ui) => {
  const container = ui.stateColors

  // Create state color tokens with visual examples
  const stateColors = [
    { name: 'hover', label: 'Hover', desc: 'Applied when the cursor hovers over an interactive element.' },
    { name: 'focus', label: 'Focus', desc: 'Applied when an element receives keyboard focus.' },
    { name: 'active', label: 'Active', desc: 'Applied during the active/pressed state of an element.' },
    { name: 'disabled', label: 'Disabled', desc: 'Applied to elements that are currently not interactive.' }
  ]

  // Create state colors container
  const stateColorsGrid = createElement({
    tag: 'div',
    class: 'color-state-grid'
  })

  stateColors.forEach(state => {
    // Create state container
    const stateContainer = createElement({
      tag: 'div',
      class: 'state-color-container'
    })

    // Create state example
    const stateExample = createElement({
      tag: 'div',
      class: `state-color-example state-${state.name}`,
      text: state.label
    })

    // Create state info
    const stateInfo = createElement({
      tag: 'div',
      class: 'state-color-info'
    })

    // State label
    const stateLabel = createElement({
      tag: 'div',
      class: 'state-color-label',
      text: `${state.label} State`
    })

    // State description
    const stateDesc = createElement({
      tag: 'div',
      class: 'state-color-value',
      text: state.desc
    })

    stateInfo.appendChild(stateLabel)
    stateInfo.appendChild(stateDesc)
    stateContainer.appendChild(stateExample)
    stateContainer.appendChild(stateInfo)
    stateColorsGrid.appendChild(stateContainer)
  })

  container.appendChild(stateColorsGrid)
}

export const initDynamicTheme = (ui) => {
  const container = ui.themeDemo

  // Create theme preview
  const themePreviewContainer = createElement({
    tag: 'div',
    class: 'theme-preview-container'
  })

  const themePreviewCard = createElement({
    tag: 'div',
    class: 'theme-preview-card'
  })

  const themeTitle = createElement({
    tag: 'h3',
    class: 'theme-preview-title',
    text: 'Current Theme: Ocean'
  })

  // Show theme color samples
  const themeColorChips = createElement({
    tag: 'div',
    class: 'theme-color-chips'
  })

  // Primary color
  const primaryChip = createElement({
    tag: 'div',
    class: 'theme-color-chip primary-chip',
    text: 'Primary'
  })

  // Secondary color
  const secondaryChip = createElement({
    tag: 'div',
    class: 'theme-color-chip secondary-chip',
    text: 'Secondary'
  })

  // Tertiary color
  const tertiaryChip = createElement({
    tag: 'div',
    class: 'theme-color-chip tertiary-chip',
    text: 'Tertiary'
  })

  themeColorChips.appendChild(primaryChip)
  themeColorChips.appendChild(secondaryChip)
  themeColorChips.appendChild(tertiaryChip)

  // Demo content
  const demoContent = createElement({
    tag: 'div',
    class: 'theme-demo-content'
  })

  const demoHeading = createElement({
    tag: 'div',
    class: 'theme-demo-heading',
    text: 'Sample UI Elements'
  })

  const demoButton = createElement({
    tag: 'button',
    class: 'theme-demo-button',
    text: 'Button'
  })

  const demoInput = createElement({
    tag: 'input',
    class: 'theme-demo-input',
    placeholder: 'Text input'
  })

  demoContent.appendChild(demoHeading)
  demoContent.appendChild(demoButton)
  demoContent.appendChild(demoInput)

  themePreviewCard.appendChild(themeTitle)
  themePreviewCard.appendChild(themeColorChips)
  themePreviewCard.appendChild(demoContent)
  themePreviewContainer.appendChild(themePreviewCard)

  // Theme switchers
  const themeSwitchers = createElement({
    tag: 'div',
    class: 'theme-switchers'
  })

  const themes = [
    { name: 'ocean', label: 'Ocean Theme' },
    { name: 'forest', label: 'Forest Theme' },
    { name: 'sunset', label: 'Sunset Theme' },
    { name: 'spring', label: 'Spring Theme' }
  ]

  themes.forEach(theme => {
    const button = createButton({
      text: theme.label,
      variant: 'filled',
      class: `theme-button theme-${theme.name} ${theme.name === 'ocean' ? 'active-theme' : ''}`
    })

    button.on('click', () => {
      // Remove active class from all buttons
      const allButtons = themeSwitchers.querySelectorAll('.theme-button')
      allButtons.forEach(btn => btn.classList.remove('active-theme'))

      // Add active class to clicked button
      button.element.classList.add('active-theme')

      // Change theme
      document.body.setAttribute('data-theme', theme.name)
      themeTitle.textContent = `Current Theme: ${theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}`
    })

    themeSwitchers.appendChild(button.element)
  })

  // Dark mode toggle
  const darkModeContainer = createElement({
    tag: 'div',
    class: 'dark-mode-container'
  })

  const darkModeLabel = createElement({
    tag: 'span',
    class: 'dark-mode-label',
    text: 'Dark Mode:'
  })

  const darkModeButton = createButton({
    text: 'Toggle Dark Mode',
    variant: 'outlined'
  })

  darkModeButton.on('click', () => {
    const currentMode = document.body.getAttribute('data-theme-mode')
    const newMode = currentMode === 'dark' ? 'light' : 'dark'
    document.body.setAttribute('data-theme-mode', newMode)
    darkModeButton.setText(newMode === 'dark' ? 'Switch to Light' : 'Switch to Dark')
  })

  darkModeContainer.appendChild(darkModeLabel)
  darkModeContainer.appendChild(darkModeButton.element)

  container.appendChild(themePreviewContainer)
  container.appendChild(themeSwitchers)
  container.appendChild(darkModeContainer)
}

export const createColorsLayout = () => [
  // Color Palettes Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Color Palettes' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Color palettes include various tones that can be used throughout your app. Each tone has specific use cases and accessibility considerations.' }],
    [createElement, 'palettes', { id: 'palettes', class: 'color-palettes' }]
  ],

  // Theme Colors Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Theme Colors' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Theme colors provide semantic meaning and are used consistently across components. Use these tokens to maintain visual consistency and accessibility.' }],
    [createElement, 'themeColors', { id: 'themeColors', class: 'theme-colors' }]
  ],

  // State Colors Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'State Colors' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'State colors communicate the status of components and provide visual feedback for interactions.' }],
    [createElement, 'stateColors', { id: 'stateColors', class: 'state-colors' }]
  ],

  // Colors in Components Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Theme Demo' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Try different themes to see how color tokens adapt to maintain consistency across themes and color modes.' }],
    [createElement, 'themeDemo', { id: 'themeDemo', class: 'theme-demo' }]
  ],

  // CSS Variables and Usage Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Using Colors in Code' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Learn how to use color tokens in your SCSS and JavaScript code.' }],
    [createElement, { tag: 'div', class: 'code-examples' },
      [createElement, { tag: 'h3', text: 'SCSS Usage' }],
      [createElement, {
        tag: 'pre', class: 'code-block', text: `@use 'mtrl/src/styles/abstract/theme' as t;

.my-element {
  background-color: t.color('primary');
  color: t.color('on-primary');
  
  &:hover {
    background-color: t.color('primary-container');
  }
}`
      }],
      [createElement, { tag: 'h3', text: 'JavaScript Theme Access' }],
      [createElement, {
        tag: 'pre', class: 'code-block', text: `// Dynamically change themes
document.body.setAttribute('data-theme', 'ocean');

// Toggle between light and dark mode
const currentMode = document.body.getAttribute('data-theme-mode');
document.body.setAttribute('data-theme-mode', 
  currentMode === 'dark' ? 'light' : 'dark');`
      }]
    ]
  ]
]
