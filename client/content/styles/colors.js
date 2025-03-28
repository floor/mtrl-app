// src/client/content/styles/colors.js

import {
  contentLayout
} from '../../layout'

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

  initThemeColors(ui)
  initColorPalettes(ui)
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

  // Create semantic color tokens with comprehensive neutral colors
  const semanticColors = [
    // Primary colors
    { name: 'primary', label: 'Primary' },
    { name: 'on-primary', label: 'On Primary' },
    { name: 'primary-container', label: 'Primary Container' },
    { name: 'on-primary-container', label: 'On Primary Container' },

    // Secondary colors
    { name: 'secondary', label: 'Secondary' },
    { name: 'on-secondary', label: 'On Secondary' },
    { name: 'secondary-container', label: 'Secondary Container' },
    { name: 'on-secondary-container', label: 'On Secondary Container' },

    // Tertiary colors
    { name: 'tertiary', label: 'Tertiary' },
    { name: 'on-tertiary', label: 'On Tertiary' },
    { name: 'tertiary-container', label: 'Tertiary Container' },
    { name: 'on-tertiary-container', label: 'On Tertiary Container' },

    // Error colors
    { name: 'error', label: 'Error' },
    { name: 'on-error', label: 'On Error' },

    // Surface colors with title
    { name: 'title-neutrals', label: 'Neutral Colors', type: 'title' },

    // Basic surface
    { name: 'surface', label: 'Surface' },
    { name: 'on-surface', label: 'On Surface' },
    { name: 'on-surface-variant', label: 'On Surface Variant' },

    // Surface variants
    { name: 'surface-dim', label: 'Surface Dim' },
    { name: 'surface-bright', label: 'Surface Bright' },

    // Surface container system
    { name: 'surface-container-lowest', label: 'Container Lowest' },
    { name: 'surface-container-low', label: 'Container Low' },
    { name: 'surface-container', label: 'Container' },
    { name: 'surface-container-high', label: 'Container High' },
    { name: 'surface-container-highest', label: 'Container Highest' },

    // Outline colors
    { name: 'outline', label: 'Outline' },
    { name: 'outline-variant', label: 'Outline Variant' }
  ]

  // Create container for theme colors
  const themeColorsGrid = createElement({
    tag: 'div',
    class: 'color-theme-grid'
  })

  // Function to create color section title
  const createSectionTitle = (label) => {
    const titleElement = createElement({
      tag: 'div',
      class: 'theme-color-section-title',
      text: label
    })
    return titleElement
  }

  semanticColors.forEach(color => {
    // If this is a section title, render it differently
    if (color.type === 'title') {
      themeColorsGrid.appendChild(createSectionTitle(color.label))
      return
    }

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
      } else if (color.name.startsWith('surface') || color.name === 'outline' || color.name === 'outline-variant') {
        // All surface and outline variants use on-surface for text
        textColor = 'var(--mtrl-sys-color-on-surface)'
      } else {
        textColor = '#fff'
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

  // Theme switchers
  const themeSwitchers = createElement({
    tag: 'div',
    class: 'theme-switchers'
  })

  const themes = [
    { name: 'ocean', label: 'Ocean Theme' },
    { name: 'forest', label: 'Forest Theme' },
    { name: 'sunset', label: 'Sunset Theme' },
    { name: 'material', label: 'Material Theme' },
    { name: 'spring', label: 'Spring Theme' },
    { name: 'summer', label: 'Summer Theme' },
    { name: 'autumn', label: 'Autumn Theme' },
    { name: 'winter', label: 'Winter Theme' },
    { name: 'bluekhaki', label: 'Blue Khaki' },
    { name: 'brownbeige', label: 'Brown Beige' },
    { name: 'tealcaramel', label: 'Teal Caramel' },
    { name: 'greenbeige', label: 'Green Beige' },
    { name: 'sageivory', label: 'Sage Ivory' },
    { name: 'browngreen', label: 'Brown Green' }
  ]

  themes.forEach(theme => {
    const button = createButton({
      text: theme.label,
      variant: 'filled',
      size: 'small',
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

  const darkModeButton = createButton({
    text: 'Toggle Dark Mode',
    variant: 'outlined',
    size: 'small'
  })

  themeSwitchers.appendChild(darkModeButton.element)

  darkModeButton.on('click', () => {
    const currentMode = document.body.getAttribute('data-theme-mode')
    const newMode = currentMode === 'dark' ? 'light' : 'dark'
    document.body.setAttribute('data-theme-mode', newMode)
    darkModeButton.setText(newMode === 'dark' ? 'Switch to Light' : 'Switch to Dark')
  })

  container.appendChild(themeTitle)
  container.appendChild(themeColorChips)
  container.appendChild(themeSwitchers)
}

export const createColorsLayout = () => [

  // Colors in Components Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Theme Switcher' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Try different themes to see how color tokens adapt to maintain consistency across themes and color modes.' }],
    [createElement, 'themeDemo', { id: 'themeDemo', class: 'theme-demo' }]
  ],

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

  // CSS Variables and Usage Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Using Colors in Code' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Learn how to use color tokens and the neutral surface system effectively in your SCSS and JavaScript code.' }],
    [createElement, { tag: 'div', class: 'code-examples' },
    // SCSS Usage Examples
      [createElement, { tag: 'h3', text: 'SCSS Usage Examples' }],
      [createElement, {
        tag: 'pre', class: 'code-block', text: `@use 'mtrl/src/styles/abstract/theme' as t;

// Basic color usage for a button component
.custom-button {
  // Primary colors for the main state
  background-color: t.color('primary');
  color: t.color('on-primary');
  border: none;
  
  // Container colors for hover state
  &:hover {
    background-color: t.color('primary-container');
    color: t.color('on-primary-container');
  }
  
  // Disabled state using surface and opacity
  &:disabled {
    background-color: t.color('surface-container');
    color: t.alpha('on-surface', 0.38); // 38% opacity for disabled text
    cursor: not-allowed;
  }
}`
      }],

      // Surface System Example
      [createElement, { tag: 'h3', text: 'Using the Surface Container System' }],
      [createElement, {
        tag: 'pre', class: 'code-block', text: `@use 'mtrl/src/styles/abstract/theme' as t;
@use 'mtrl/src/styles/abstract/functions' as f;

// Card with proper elevation and surface hierarchy
.card {
  // Base container for the card
  background-color: t.color('surface-container');
  border-radius: f.get-shape('medium');
  overflow: hidden;
  
  // Card header with slightly higher surface
  &__header {
    background-color: t.color('surface-container-high');
    padding: 16px;
    border-bottom: 1px solid t.color('outline-variant');
  }
  
  // Card content with base surface
  &__content {
    padding: 16px;
  }
  
  // Card footer with lower surface
  &__footer {
    background-color: t.color('surface-container-low');
    padding: 16px;
    border-top: 1px solid t.color('outline-variant');
  }
  
  // Different card states
  &--selected {
    background-color: t.color('surface-container-highest');
    outline: 2px solid t.color('primary');
  }
  
  &--inactive {
    background-color: t.color('surface-dim');
  }
  
  // Card inside a dialog should use bright surface
  .dialog & {
    background-color: t.color('surface-bright');
  }
}`
      }],

      // Mixing with State Colors
      [createElement, { tag: 'h3', text: 'Dynamic State Interactions' }],
      [createElement, {
        tag: 'pre', class: 'code-block', text: `@use 'mtrl/src/styles/abstract/theme' as t;

// Navigation item with state interactions
.nav-item {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 4px;
  background-color: t.color('surface');
  color: t.color('on-surface');
  position: relative;
  cursor: pointer;
  
  // Using state layers with proper opacity
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    opacity: 0;
    background-color: t.color('primary');
    transition: opacity 0.2s ease;
    pointer-events: none;
  }
  
  // Interactive states
  &:hover::before {
    opacity: 0.08; // Hover state layer opacity
  }
  
  &:focus-visible {
    outline: 2px solid t.color('outline');
    outline-offset: 2px;
  }
  
  &:active::before {
    opacity: 0.12; // Pressed state layer opacity
  }
  
  // Selected state
  &--selected {
    background-color: t.color('secondary-container');
    color: t.color('on-secondary-container');
    
    &::before {
      background-color: t.color('on-secondary-container');
    }
  }
}`
      }],

      // JavaScript Theme Management
      [createElement, { tag: 'h3', text: 'JavaScript Theme Management' }],
      [createElement, {
        tag: 'pre', class: 'code-block', text: `// Theme management utility
class ThemeManager {
  constructor(defaultTheme = 'material', defaultMode = 'light') {
    this.theme = localStorage.getItem('user-theme') || defaultTheme;
    this.mode = localStorage.getItem('theme-mode') || defaultMode;
    this.applyTheme();
    this.initListeners();
  }
  
  // Apply current theme settings to DOM
  applyTheme() {
    document.body.setAttribute('data-theme', this.theme);
    document.body.setAttribute('data-theme-mode', this.mode);
    localStorage.setItem('user-theme', this.theme);
    localStorage.setItem('theme-mode', this.mode);
    
    // Dispatch event for other components to react
    document.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme: this.theme, mode: this.mode }
    }));
  }
  
  // Switch to a different theme
  setTheme(themeName) {
    this.theme = themeName;
    this.applyTheme();
  }
  
  // Toggle between light and dark mode
  toggleMode() {
    this.mode = this.mode === 'dark' ? 'light' : 'dark';
    this.applyTheme();
    return this.mode;
  }
  
  // Initialize system preference listeners
  initListeners() {
    // Listen for system preference changes
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    prefersDark.addEventListener('change', (e) => {
      if (localStorage.getItem('theme-mode-auto') === 'true') {
        this.mode = e.matches ? 'dark' : 'light';
        this.applyTheme();
      }
    });
  }
  
  // Use system preference for dark/light mode
  useSystemPreference() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.mode = prefersDark ? 'dark' : 'light';
    localStorage.setItem('theme-mode-auto', 'true');
    this.applyTheme();
  }
}

// Usage
const themeManager = new ThemeManager();

// Button click handlers
document.querySelector('#theme-material').addEventListener('click', () => {
  themeManager.setTheme('material');
});

document.querySelector('#toggle-dark-mode').addEventListener('click', () => {
  const newMode = themeManager.toggleMode();
  document.querySelector('#toggle-dark-mode').textContent = 
    newMode === 'dark' ? 'Switch to Light' : 'Switch to Dark';
});`
      }],

      // Advanced Color Function Example
      [createElement, { tag: 'h3', text: 'Programmatically Working with Theme Colors' }],
      [createElement, {
        tag: 'pre', class: 'code-block', text: `// Access CSS variables and manipulate colors in JavaScript
function getThemeColor(colorName) {
  const element = document.documentElement;
  const color = getComputedStyle(element)
    .getPropertyValue(\`--mtrl-sys-color-\${colorName}\`)
    .trim();
  return color;
}

function getRGBComponents(colorName) {
  const element = document.documentElement;
  const rgb = getComputedStyle(element)
    .getPropertyValue(\`--mtrl-sys-color-\${colorName}-rgb\`)
    .trim();
  return rgb; // Returns e.g. "100, 66, 214"
}

function createSurfaceVariant(surfaceType, overlayOpacity = 0.05) {
  const surface = getThemeColor(surfaceType);
  const onSurfaceRGB = getRGBComponents('on-surface');
  
  // Create a color with specified overlay opacity
  return \`linear-gradient(0deg, 
    rgba(\${onSurfaceRGB}, \${overlayOpacity}), 
    rgba(\${onSurfaceRGB}, \${overlayOpacity})), \${surface}\`;
}

// Generate a custom surface for special components
function applyCustomSurface(element, level = 1) {
  // Select appropriate surface based on elevation level
  let baseSurface;
  switch(level) {
    case 0: baseSurface = 'surface'; break;
    case 1: baseSurface = 'surface-container-low'; break;
    case 2: baseSurface = 'surface-container'; break;
    case 3: baseSurface = 'surface-container-high'; break;
    default: baseSurface = 'surface-container-highest';
  }
  
  // Apply the custom surface with appropriate overlay
  element.style.background = createSurfaceVariant(baseSurface, 0.04 * level);
  
  // Set text color based on content
  element.style.color = getThemeColor('on-surface');
}`
      }]
    ]
  ]
]
