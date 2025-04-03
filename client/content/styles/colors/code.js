
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
