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
    const paletteContainer = createElement({
      tag: 'div',
      class: 'color-palette'
    })

    const paletteTitle = createElement({
      tag: 'h3',
      class: 'color-palette__title',
      text: palette.label
    })

    paletteContainer.appendChild(paletteTitle)

    palette.tones.forEach(tone => {
      const swatch = createElement({
        tag: 'div',
        class: `color-swatch ${palette.name}-${tone}`,
        attributes: {
          'data-color': `${palette.name}-${tone}`
        }
      })

      const swatchLabel = createElement({
        tag: 'span',
        class: 'color-swatch__label',
        text: `${tone}`
      })

      swatch.appendChild(swatchLabel)
      paletteContainer.appendChild(swatch)
    })

    container.appendChild(paletteContainer)
  })
}

export const initThemeColors = (ui) => {
  const container = ui.themeColors

  // Create semantic color tokens
  const semanticColors = [
    { name: 'surface', label: 'Surface' },
    { name: 'surface-container', label: 'Surface Container' },
    { name: 'on-surface', label: 'On Surface' },
    { name: 'primary', label: 'Primary' },
    { name: 'on-primary', label: 'On Primary' },
    { name: 'secondary', label: 'Secondary' },
    { name: 'on-secondary', label: 'On Secondary' },
    { name: 'tertiary', label: 'Tertiary' },
    { name: 'on-tertiary', label: 'On Tertiary' },
    { name: 'outline', label: 'Outline' }
  ]

  const themeRow = createElement({
    tag: 'div',
    class: 'color-theme-row'
  })

  semanticColors.forEach(color => {
    const swatch = createElement({
      tag: 'div',
      class: `color-swatch color-${color.name}`,
      attributes: {
        'data-color': color.name
      }
    })

    const swatchLabel = createElement({
      tag: 'span',
      class: 'color-swatch__label',
      text: color.label
    })

    swatch.appendChild(swatchLabel)
    themeRow.appendChild(swatch)
  })

  container.appendChild(themeRow)
}

export const initColorState = (ui) => {
  const container = ui.stateColors

  // Create state color tokens
  const stateColors = [
    { name: 'primary-hover', label: 'Hover' },
    { name: 'primary-focus', label: 'Focus' },
    { name: 'primary-active', label: 'Active' },
    { name: 'primary-disabled', label: 'Disabled' }
  ]

  const stateRow = createElement({
    tag: 'div',
    class: 'color-state-row'
  })

  stateColors.forEach(color => {
    const swatch = createElement({
      tag: 'div',
      class: `color-swatch state-${color.name}`,
      attributes: {
        'data-color': color.name
      }
    })

    const swatchLabel = createElement({
      tag: 'span',
      class: 'color-swatch__label',
      text: color.label
    })

    swatch.appendChild(swatchLabel)
    stateRow.appendChild(swatch)
  })

  container.appendChild(stateRow)
}

export const initDynamicTheme = (ui) => {
  const container = ui.themeDemo

  const themeButtons = [
    { name: 'ocean', label: 'Ocean Theme' },
    { name: 'forest', label: 'Forest Theme' },
    { name: 'sunset', label: 'Sunset Theme' },
    { name: 'spring', label: 'Spring Theme' }
  ]

  themeButtons.forEach(theme => {
    const button = createButton({
      text: theme.label,
      variant: 'filled',
      class: `theme-button theme-${theme.name}`
    })

    button.on('click', () => {
      document.body.setAttribute('data-theme', theme.name)
    })

    container.appendChild(button.element)
  })

  // Add dark mode toggle
  const darkModeButton = createButton({
    text: 'Toggle Dark Mode',
    variant: 'outlined',
    class: 'dark-mode-toggle'
  })

  darkModeButton.on('click', () => {
    const currentTheme = document.body.getAttribute('data-theme-mode')
    document.body.setAttribute('data-theme-mode', currentTheme === 'dark' ? 'light' : 'dark')
  })

  container.appendChild(darkModeButton.element)
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

// Add custom styles for the color documentation
const addColorStyles = () => {
  const style = document.createElement('style')
  style.textContent = `
    .color-palettes {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 24px;
      margin-top: 24px;
    }
    
    .color-palette__title {
      margin-bottom: 12px;
      font-size: 1rem;
    }
    
    .color-swatch {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
      margin-bottom: 8px;
      border-radius: 8px;
      position: relative;
      transition: transform 0.2s ease;
      overflow: hidden;
    }
    
    .color-swatch:hover {
      transform: scale(1.02);
    }
    
    .color-swatch__label {
      font-size: 0.85rem;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    .theme-colors, .state-colors {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }
    
    .theme-demo {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 24px;
    }
    
    .code-block {
      background-color: var(--mtrl-sys-color-surface-container);
      padding: 16px;
      border-radius: 8px;
      overflow: auto;
      font-family: monospace;
      margin: 12px 0 24px 0;
    }
    
    /* Dynamic color classes */
    .color-primary { background-color: var(--mtrl-sys-color-primary); color: var(--mtrl-sys-color-on-primary); }
    .color-secondary { background-color: var(--mtrl-sys-color-secondary); color: var(--mtrl-sys-color-on-secondary); }
    .color-tertiary { background-color: var(--mtrl-sys-color-tertiary); color: var(--mtrl-sys-color-on-tertiary); }
    .color-error { background-color: var(--mtrl-sys-color-error); color: var(--mtrl-sys-color-on-error); }
    .color-surface { background-color: var(--mtrl-sys-color-surface); color: var(--mtrl-sys-color-on-surface); }
    .color-surface-container { background-color: var(--mtrl-sys-color-surface-container); color: var(--mtrl-sys-color-on-surface); }
    .color-on-surface { background-color: var(--mtrl-sys-color-on-surface); color: var(--mtrl-sys-color-surface); }
    .color-on-primary { background-color: var(--mtrl-sys-color-on-primary); color: var(--mtrl-sys-color-primary); }
    .color-on-secondary { background-color: var(--mtrl-sys-color-on-secondary); color: var(--mtrl-sys-color-secondary); }
    .color-on-tertiary { background-color: var(--mtrl-sys-color-on-tertiary); color: var(--mtrl-sys-color-tertiary); }
    .color-outline { background-color: var(--mtrl-sys-color-outline); color: var(--mtrl-sys-color-on-surface); }
    
    .primary-10 { background-color: var(--mtrl-ref-palette-primary10); color: var(--mtrl-ref-palette-primary90); }
    .primary-30 { background-color: var(--mtrl-ref-palette-primary30); color: var(--mtrl-ref-palette-primary90); }
    .primary-50 { background-color: var(--mtrl-ref-palette-primary50); color: var(--mtrl-ref-palette-primary90); }
    .primary-70 { background-color: var(--mtrl-ref-palette-primary70); color: var(--mtrl-ref-palette-primary10); }
    .primary-90 { background-color: var(--mtrl-ref-palette-primary90); color: var(--mtrl-ref-palette-primary10); }
    
    .secondary-10 { background-color: var(--mtrl-ref-palette-secondary10); color: var(--mtrl-ref-palette-secondary90); }
    .secondary-30 { background-color: var(--mtrl-ref-palette-secondary30); color: var(--mtrl-ref-palette-secondary90); }
    .secondary-50 { background-color: var(--mtrl-ref-palette-secondary50); color: var(--mtrl-ref-palette-secondary90); }
    .secondary-70 { background-color: var(--mtrl-ref-palette-secondary70); color: var(--mtrl-ref-palette-secondary10); }
    .secondary-90 { background-color: var(--mtrl-ref-palette-secondary90); color: var(--mtrl-ref-palette-secondary10); }
    
    .tertiary-10 { background-color: var(--mtrl-ref-palette-tertiary10); color: var(--mtrl-ref-palette-tertiary90); }
    .tertiary-30 { background-color: var(--mtrl-ref-palette-tertiary30); color: var(--mtrl-ref-palette-tertiary90); }
    .tertiary-50 { background-color: var(--mtrl-ref-palette-tertiary50); color: var(--mtrl-ref-palette-tertiary90); }
    .tertiary-70 { background-color: var(--mtrl-ref-palette-tertiary70); color: var(--mtrl-ref-palette-tertiary10); }
    .tertiary-90 { background-color: var(--mtrl-ref-palette-tertiary90); color: var(--mtrl-ref-palette-tertiary10); }
    
    .error-10 { background-color: var(--mtrl-ref-palette-error10); color: var(--mtrl-ref-palette-error90); }
    .error-30 { background-color: var(--mtrl-ref-palette-error30); color: var(--mtrl-ref-palette-error90); }
    .error-50 { background-color: var(--mtrl-ref-palette-error50); color: var(--mtrl-ref-palette-error90); }
    .error-70 { background-color: var(--mtrl-ref-palette-error70); color: var(--mtrl-ref-palette-error10); }
    .error-90 { background-color: var(--mtrl-ref-palette-error90); color: var(--mtrl-ref-palette-error10); }
    
    /* State colors */
    .state-primary-hover { background-color: var(--mtrl-sys-state-primary-hover); color: var(--mtrl-sys-color-on-primary); }
    .state-primary-focus { background-color: var(--mtrl-sys-state-primary-focus); color: var(--mtrl-sys-color-on-primary); }
    .state-primary-active { background-color: var(--mtrl-sys-state-primary-active); color: var(--mtrl-sys-color-on-primary); }
    .state-primary-disabled { background-color: var(--mtrl-sys-state-disabled); color: var(--mtrl-sys-color-on-disabled); }
  `
  document.head.appendChild(style)
}

// Call this function when the module loads
addColorStyles()
