// src/client/content/styles/colors.js

import {
  contentLayout
} from '../../config'

import {
  createLayout,
  createElement,
  createButton
} from 'mtrl'

// Import the SCSS styles - this should be handled by your bundler
// The styles would be imported in the main.scss file or similar
// import '../../styles/content/colors.scss'

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
    // Create a container for each palette
    const paletteSection = createElement({
      tag: 'div',
      class: 'palette-section'
    })

    // Add the palette label
    const paletteHeading = createElement({
      tag: 'h3',
      class: 'palette-heading',
      text: palette.label
    })

    paletteSection.appendChild(paletteHeading)

    // Create a row for the swatches
    const swatchesRow = createElement({
      tag: 'div',
      class: 'palette-swatches-row'
    })

    // Create swatches for each tone
    palette.tones.forEach(tone => {
      // Create a swatch with system colors
      let backgroundColor

      // Use theme system colors based on the palette and tone
      if (tone === 50) {
        // Use the main system color for tone 50
        backgroundColor = `var(--mtrl-sys-color-${palette.name})`
      } else if (tone < 50) {
        // For lighter tones, mix with surface color (simple approximation)
        backgroundColor = `color-mix(in srgb, var(--mtrl-sys-color-${palette.name}) ${tone * 2}%, var(--mtrl-sys-color-surface))`
      } else {
        // For darker tones, mix with on-surface color (simple approximation)
        backgroundColor = `color-mix(in srgb, var(--mtrl-sys-color-${palette.name}) ${100 - (tone - 50)}%, var(--mtrl-sys-color-on-surface))`
      }

      const swatch = createElement({
        tag: 'div',
        class: 'palette-swatch',
        style: `background-color: ${backgroundColor};`
      })

      // Add tone label
      const toneLabel = createElement({
        tag: 'div',
        class: 'palette-tone-label',
        text: tone.toString()
      })

      // Determine text color based on tone value
      toneLabel.style.color = tone < 50 ? 'var(--mtrl-sys-color-on-surface)' : 'var(--mtrl-sys-color-surface)'

      swatch.appendChild(toneLabel)
      swatchesRow.appendChild(swatch)
    })

    paletteSection.appendChild(swatchesRow)
    container.appendChild(paletteSection)
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
  const themeColorsContainer = createElement({
    tag: 'div',
    class: 'theme-colors-container'
  })

  semanticColors.forEach(color => {
    // Create a color box with the semantic color
    const colorBox = createElement({
      tag: 'div',
      class: 'theme-color-box',
      style: `background-color: var(--mtrl-sys-color-${color.name});`
    })

    // Determine appropriate text color
    // For "on-" colors we reverse the background
    if (color.name.startsWith('on-')) {
      const baseColor = color.name.substring(3)
      colorBox.style.backgroundColor = `var(--mtrl-sys-color-${baseColor})`
      colorBox.style.color = `var(--mtrl-sys-color-${color.name})`
    } else {
      // For regular colors, use the matching "on-" color if exists
      const hasMatchingOnColor = semanticColors.some(c => c.name === `on-${color.name}`)
      if (hasMatchingOnColor) {
        colorBox.style.color = `var(--mtrl-sys-color-on-${color.name})`
      } else {
        // Fallback to a contrasting color
        colorBox.style.color = color.name === 'surface' || color.name === 'surface-container'
          ? 'var(--mtrl-sys-color-on-surface)'
          : '#fff'
      }
    }

    // Add the color name
    const colorName = createElement({
      tag: 'div',
      class: 'theme-color-name',
      text: color.label
    })

    colorBox.appendChild(colorName)
    themeColorsContainer.appendChild(colorBox)
  })

  container.appendChild(themeColorsContainer)
}

export const initColorState = (ui) => {
  const container = ui.stateColors

  // Create state color tokens with visual examples
  const stateColors = [
    { name: 'hover', label: 'Hover', cssVar: '--mtrl-sys-state-primary-hover' },
    { name: 'focus', label: 'Focus', cssVar: '--mtrl-sys-state-primary-focus' },
    { name: 'active', label: 'Active', cssVar: '--mtrl-sys-state-primary-active' },
    { name: 'disabled', label: 'Disabled', cssVar: '--mtrl-sys-state-disabled' }
  ]

  // Create state colors container
  const stateColorsContainer = createElement({
    tag: 'div',
    class: 'state-colors-container'
  })

  stateColors.forEach(state => {
    // Create a state example card
    const stateCard = createElement({
      tag: 'div',
      class: 'state-color-card'
    })

    // Create a button to demonstrate the state
    const stateButton = createElement({
      tag: 'button',
      class: `state-demo-button state-${state.name}`,
      text: state.label
    })

    // Style the button to show the state color
    if (state.name === 'hover') {
      stateButton.style.backgroundColor = `var(${state.cssVar})`
    } else if (state.name === 'focus') {
      stateButton.style.backgroundColor = 'var(--mtrl-sys-color-primary)'
      stateButton.style.outline = '2px solid var(--mtrl-sys-color-outline)'
    } else if (state.name === 'active') {
      stateButton.style.backgroundColor = `var(${state.cssVar})`
      stateButton.style.transform = 'scale(0.98)'
    } else if (state.name === 'disabled') {
      stateButton.style.backgroundColor = `var(${state.cssVar})`
      stateButton.style.color = 'var(--mtrl-sys-color-on-disabled)'
      stateButton.style.opacity = '0.7'
      stateButton.disabled = true
    }

    // Add a label
    const stateLabel = createElement({
      tag: 'div',
      class: 'state-color-label',
      text: `${state.label} State`
    })

    stateCard.appendChild(stateButton)
    stateCard.appendChild(stateLabel)
    stateColorsContainer.appendChild(stateCard)
  })

  container.appendChild(stateColorsContainer)

  // Add interactive demo
  const interactiveDemo = createElement({
    tag: 'div',
    class: 'interactive-state-demo'
  })

  const demoLabel = createElement({
    tag: 'div',
    class: 'interactive-demo-label',
    text: 'Try it yourself:'
  })

  const demoButton = createElement({
    tag: 'button',
    class: 'interactive-button',
    text: 'Interactive Button'
  })

  const demoInstructions = createElement({
    tag: 'div',
    class: 'demo-instructions',
    text: 'Hover, focus, or click to see the different states'
  })

  interactiveDemo.appendChild(demoLabel)
  interactiveDemo.appendChild(demoButton)
  interactiveDemo.appendChild(demoInstructions)

  container.appendChild(interactiveDemo)
}

export const initDynamicTheme = (ui) => {
  const container = ui.themeDemo

  // Create theme preview
  const themePreview = createElement({
    tag: 'div',
    class: 'theme-preview'
  })

  const themeTitle = createElement({
    tag: 'h3',
    class: 'theme-preview-title',
    text: 'Current Theme: Ocean'
  })

  // Show theme color samples
  const themeSamples = createElement({
    tag: 'div',
    class: 'theme-samples'
  })

  // Primary color
  const primarySample = createElement({
    tag: 'div',
    class: 'theme-sample',
    text: 'Primary',
    style: 'background-color: var(--mtrl-sys-color-primary); color: var(--mtrl-sys-color-on-primary);'
  })

  // Secondary color
  const secondarySample = createElement({
    tag: 'div',
    class: 'theme-sample',
    text: 'Secondary',
    style: 'background-color: var(--mtrl-sys-color-secondary); color: var(--mtrl-sys-color-on-secondary);'
  })

  // Tertiary color
  const tertiarySample = createElement({
    tag: 'div',
    class: 'theme-sample',
    text: 'Tertiary',
    style: 'background-color: var(--mtrl-sys-color-tertiary); color: var(--mtrl-sys-color-on-tertiary);'
  })

  themeSamples.appendChild(primarySample)
  themeSamples.appendChild(secondarySample)
  themeSamples.appendChild(tertiarySample)

  themePreview.appendChild(themeTitle)
  themePreview.appendChild(themeSamples)

  container.appendChild(themePreview)

  // Theme buttons
  const themeButtons = createElement({
    tag: 'div',
    class: 'theme-buttons'
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
      variant: 'filled'
    })

    button.on('click', () => {
      document.body.setAttribute('data-theme', theme.name)
      themeTitle.textContent = `Current Theme: ${theme.label.split(' ')[0]}`
    })

    themeButtons.appendChild(button.element)
  })

  container.appendChild(themeButtons)

  // Dark mode toggle
  const themeMode = createElement({
    tag: 'div',
    class: 'theme-mode-toggle'
  })

  const themeModeLabel = createElement({
    tag: 'span',
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

  themeMode.appendChild(themeModeLabel)
  themeMode.appendChild(darkModeButton.element)

  container.appendChild(themeMode)
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

// Add this to the end of your file for now
// In production, this would be moved to SCSS files
function addColorStyles () {
  const style = document.createElement('style')
  style.textContent = `
    /* Color palettes */
    .palette-section {
      margin-bottom: 2rem;
    }
    
    .palette-heading {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }
    
    .palette-swatches-row {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.5rem;
    }
    
    .palette-swatch {
      height: 60px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .palette-tone-label {
      font-weight: bold;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }
    
    /* Theme colors styling */
    .theme-colors-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .theme-color-box {
      height: 80px;
      border-radius: 8px;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .theme-color-name {
      font-weight: bold;
    }
    
    /* State colors */
    .state-colors-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .state-color-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      border-radius: 8px;
      background-color: #f5f5f5;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .state-demo-button {
      width: 100%;
      padding: 0.75rem;
      border-radius: 4px;
      border: none;
      background-color: var(--mtrl-sys-color-primary);
      color: white;
      font-weight: bold;
      margin-bottom: 0.75rem;
    }
    
    .state-color-label {
      font-size: 0.9rem;
      color: #666;
    }
    
    .interactive-state-demo {
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      border-radius: 8px;
      background-color: #f5f5f5;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .interactive-demo-label {
      font-weight: bold;
      margin-bottom: 1rem;
    }
    
    .interactive-button {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      border: none;
      background-color: var(--mtrl-sys-color-primary);
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .interactive-button:hover {
      background-color: var(--mtrl-sys-state-primary-hover);
    }
    
    .interactive-button:focus {
      outline: 2px solid var(--mtrl-sys-color-outline);
      outline-offset: 2px;
    }
    
    .interactive-button:active {
      background-color: var(--mtrl-sys-state-primary-active);
      transform: scale(0.98);
    }
    
    .demo-instructions {
      margin-top: 1rem;
      font-size: 0.9rem;
      color: #666;
    }
    
    /* Theme preview */
    .theme-preview {
      padding: 1.5rem;
      border-radius: 8px;
      background-color: var(--mtrl-sys-color-surface);
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      margin-bottom: 1.5rem;
    }
    
    .theme-samples {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }
    
    .theme-sample {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: bold;
    }
    
    .theme-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin: 1.5rem 0;
    }
    
    .theme-mode-toggle {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1rem;
    }
  `
  document.head.appendChild(style)
}

// Call the function to add styles
addColorStyles()
