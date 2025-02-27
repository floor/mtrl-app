// src/client/content/styles/elevation.js

import {
  contentLayout
} from '../../config'

import {
  createLayout,
  createElement,
  createButton
} from 'mtrl'

export const createElevationContent = (container) => {
  const info = {
    title: 'Elevation',
    description: 'Elevation creates visual hierarchy and depth using shadows and surface positioning'
  }
  const layout = createLayout(contentLayout(info), container).component

  const ui = createLayout(createElevationLayout(), layout.body).component

  initElevationLevels(ui)
  initElevationPrinciples(ui)
  initDynamicElevation(ui)
  initElevationUsage(ui)
}

export const initElevationLevels = (ui) => {
  const container = ui.levels

  // Create elevation level examples
  const elevationLevels = [
    { level: 0, description: 'Base level for content' },
    { level: 1, description: 'For cards and elevated surfaces' },
    { level: 2, description: 'For navigation drawers' },
    { level: 3, description: 'For search bars and app bars' },
    { level: 4, description: 'For dialogs and menus' },
    { level: 5, description: 'For bottom sheets' }
  ]

  elevationLevels.forEach(elevation => {
    const elevationCard = createElement({
      tag: 'div',
      class: `elevation-card elevation-${elevation.level}`,
      attributes: {
        'data-level': elevation.level
      }
    })

    const levelIndicator = createElement({
      tag: 'div',
      class: 'elevation-level',
      text: `Level ${elevation.level}`
    })

    const levelDescription = createElement({
      tag: 'div',
      class: 'elevation-description',
      text: elevation.description
    })

    elevationCard.appendChild(levelIndicator)
    elevationCard.appendChild(levelDescription)

    container.appendChild(elevationCard)
  })
}

export const initElevationPrinciples = (ui) => {
  const container = ui.principles

  // Create principles with visual examples
  const principles = [
    {
      title: 'Shadows define elevation',
      description: 'Shadows indicate the distance between surfaces. The larger the shadow, the greater the distance.',
      exampleClass: 'elevation-principle-shadow'
    },
    {
      title: 'Elevation creates hierarchy',
      description: 'Higher elevation increases importance and brings attention to UI elements.',
      exampleClass: 'elevation-principle-hierarchy'
    },
    {
      title: 'Surface color and elevation',
      description: 'As elevation increases, surface color may shift slightly to reinforce depth.',
      exampleClass: 'elevation-principle-surface'
    }
  ]

  principles.forEach(principle => {
    const principleCard = createElement({
      tag: 'div',
      class: 'principle-card'
    })

    const principleExample = createElement({
      tag: 'div',
      class: `principle-example ${principle.exampleClass}`
    })

    // Create different shapes to demonstrate elevation principles
    if (principle.exampleClass === 'elevation-principle-shadow') {
      // Shadow demonstration with multiple elevated surfaces
      for (let i = 0; i < 3; i++) {
        const surface = createElement({
          tag: 'div',
          class: `demo-surface elevation-${i + 1}`,
          style: `transform: translateX(${i * 20}px)`
        })
        principleExample.appendChild(surface)
      }
    } else if (principle.exampleClass === 'elevation-principle-hierarchy') {
      // Hierarchy demonstration with stacked elements
      const primarySurface = createElement({
        tag: 'div',
        class: 'demo-surface demo-primary elevation-4',
        text: 'Primary'
      })

      const secondarySurface = createElement({
        tag: 'div',
        class: 'demo-surface demo-secondary elevation-2',
        text: 'Secondary'
      })

      const tertiarySurface = createElement({
        tag: 'div',
        class: 'demo-surface demo-tertiary elevation-0',
        text: 'Tertiary'
      })

      principleExample.appendChild(primarySurface)
      principleExample.appendChild(secondarySurface)
      principleExample.appendChild(tertiarySurface)
    } else if (principle.exampleClass === 'elevation-principle-surface') {
      // Surface color shifts with elevation
      for (let i = 0; i < 4; i++) {
        const surface = createElement({
          tag: 'div',
          class: `demo-surface surface-level-${i}`,
          text: `Level ${i}`
        })
        principleExample.appendChild(surface)
      }
    }

    const principleContent = createElement({
      tag: 'div',
      class: 'principle-content'
    })

    const principleTitle = createElement({
      tag: 'h3',
      class: 'principle-title',
      text: principle.title
    })

    const principleDescription = createElement({
      tag: 'p',
      class: 'principle-description',
      text: principle.description
    })

    principleContent.appendChild(principleTitle)
    principleContent.appendChild(principleDescription)
    principleCard.appendChild(principleExample)
    principleCard.appendChild(principleContent)

    container.appendChild(principleCard)
  })
}

export const initDynamicElevation = (ui) => {
  const container = ui.dynamic

  // Create dynamic elevation examples
  const dynamicCard = createElement({
    tag: 'div',
    class: 'dynamic-card elevation-1'
  })

  const cardContent = createElement({
    tag: 'div',
    class: 'dynamic-card-content'
  })

  const cardTitle = createElement({
    tag: 'h3',
    class: 'dynamic-card-title',
    text: 'Dynamic Elevation'
  })

  const cardDescription = createElement({
    tag: 'p',
    class: 'dynamic-card-description',
    text: 'Elements can change elevation in response to user interaction. Hover or click to see the elevation change.'
  })

  const buttonContainer = createElement({
    tag: 'div',
    class: 'dynamic-button-container'
  })

  const elevateButton = createButton({
    text: 'Elevate Card',
    variant: 'filled'
  })

  let currentElevation = 1

  elevateButton.on('click', () => {
    // Cycle through elevations
    currentElevation = (currentElevation % 5) + 1

    // Remove all elevation classes
    for (let i = 0; i <= 5; i++) {
      dynamicCard.classList.remove(`elevation-${i}`)
    }

    // Add new elevation class
    dynamicCard.classList.add(`elevation-${currentElevation}`)

    // Update button text
    elevateButton.setText(`Elevation Level: ${currentElevation}`)
  })

  cardContent.appendChild(cardTitle)
  cardContent.appendChild(cardDescription)
  buttonContainer.appendChild(elevateButton.element)
  cardContent.appendChild(buttonContainer)
  dynamicCard.appendChild(cardContent)

  container.appendChild(dynamicCard)
}

export const initElevationUsage = (ui) => {
  const container = ui.usage

  // Create examples of common usage patterns
  const usageExamples = [
    {
      component: 'Card',
      elevation: 1,
      description: 'Cards use elevation 1 to lift content from the background and create containment.'
    },
    {
      component: 'Dialog',
      elevation: 4,
      description: 'Dialogs use higher elevation (4) to appear above other content and focus user attention.'
    },
    {
      component: 'Navigation Bar',
      elevation: 2,
      description: 'Navigation elements use elevation 2 to separate from content but remain accessible.'
    },
    {
      component: 'Floating Action Button',
      elevation: 3,
      description: 'FABs use elevation 3 to stand out as primary actions.'
    }
  ]

  usageExamples.forEach(example => {
    const usageContainer = createElement({
      tag: 'div',
      class: 'usage-container'
    })

    const componentExample = createElement({
      tag: 'div',
      class: `component-example elevation-${example.elevation}`
    })

    const componentIcon = createElement({
      tag: 'div',
      class: `component-icon component-${example.component.toLowerCase().replace(' ', '-')}`
    })

    const componentName = createElement({
      tag: 'div',
      class: 'component-name',
      text: example.component
    })

    const componentElevation = createElement({
      tag: 'div',
      class: 'component-elevation',
      text: `Elevation ${example.elevation}`
    })

    const componentDescription = createElement({
      tag: 'p',
      class: 'component-description',
      text: example.description
    })

    componentExample.appendChild(componentIcon)
    componentExample.appendChild(componentName)
    componentExample.appendChild(componentElevation)

    usageContainer.appendChild(componentExample)
    usageContainer.appendChild(componentDescription)

    container.appendChild(usageContainer)
  })
}

export const createElevationLayout = () => [
  // Elevation Levels Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Elevation Levels' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'The MTRL framework provides standard elevation levels to create consistent depth throughout your application.' }],
    [createElement, 'levels', { id: 'levels', class: 'elevation-levels-container' }]
  ],

  // Elevation Principles Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Elevation Principles' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Elevation helps establish hierarchy, meaning, and focus in your UI through the use of shadows and surface positioning.' }],
    [createElement, 'principles', { id: 'principles', class: 'elevation-principles-container' }]
  ],

  // Dynamic Elevation Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Dynamic Elevation' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Elements can change elevation in response to user interaction, providing visual feedback and reinforcing relationships.' }],
    [createElement, 'dynamic', { id: 'dynamic', class: 'dynamic-elevation-container' }]
  ],

  // Elevation Usage Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Common Usage Patterns' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Different UI components use specific elevation levels to reinforce their purpose and importance.' }],
    [createElement, 'usage', { id: 'usage', class: 'elevation-usage-container' }]
  ],

  // Elevation in Code Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Using Elevation in Code' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Learn how to use elevation in your SCSS and JavaScript code.' }],
    [createElement, { tag: 'div', class: 'code-examples' },
      [createElement, { tag: 'h3', text: 'SCSS Usage' }],
      [createElement, {
        tag: 'pre', class: 'code-block', text: `@use 'mtrl/src/styles/abstract/config' as c;

.my-card {
  @include c.elevation(1);
  
  &:hover {
    @include c.elevation(2);
    transition: box-shadow 0.2s ease;
  }
}`
      }],
      [createElement, { tag: 'h3', text: 'JavaScript Component Usage' }],
      [createElement, {
        tag: 'pre', class: 'code-block', text: `// Creating a component with elevation
const card = createElement({
  tag: 'div',
  class: 'elevation-1',
  // other properties...
});

// Dynamically changing elevation
element.classList.remove('elevation-1');
element.classList.add('elevation-3');`
      }]
    ]
  ]
]

// Add custom styles for the elevation documentation
const addElevationStyles = () => {
  const style = document.createElement('style')
  style.textContent = `
    /* Elevation levels container */
    .elevation-levels-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 24px;
      margin-top: 24px;
    }
    
    .elevation-card {
      padding: 24px;
      border-radius: 12px;
      background-color: var(--mtrl-sys-color-surface);
      transition: all 0.3s ease;
      height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .elevation-level {
      font-weight: 500;
      font-size: 1.1rem;
      margin-bottom: 8px;
    }
    
    .elevation-description {
      font-size: 0.9rem;
      color: var(--mtrl-sys-color-on-surface-variant);
    }
    
    /* Add the actual elevation classes */
    .elevation-0 {
      box-shadow: none;
    }
    
    .elevation-1 {
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    }
    
    .elevation-2 {
      box-shadow: 0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12);
    }
    
    .elevation-3 {
      box-shadow: 0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10);
    }
    
    .elevation-4 {
      box-shadow: 0 14px 28px rgba(0,0,0,0.20), 0 10px 10px rgba(0,0,0,0.15);
    }
    
    .elevation-5 {
      box-shadow: 0 19px 38px rgba(0,0,0,0.25), 0 15px 12px rgba(0,0,0,0.18);
    }
    
    /* Elevation principles */
    .elevation-principles-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-top: 24px;
    }
    
    .principle-card {
      display: flex;
      border-radius: 12px;
      background-color: var(--mtrl-sys-color-surface-container-low);
      overflow: hidden;
    }
    
    @media (max-width: 768px) {
      .principle-card {
        flex-direction: column;
      }
    }
    
    .principle-example {
      flex: 1;
      min-height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      position: relative;
      background-color: var(--mtrl-sys-color-surface);
    }
    
    .principle-content {
      flex: 2;
      padding: 24px;
    }
    
    .principle-title {
      margin: 0 0 12px 0;
      font-weight: 500;
    }
    
    .principle-description {
      margin: 0;
      color: var(--mtrl-sys-color-on-surface-variant);
    }
    
    /* Specific principle examples */
    .elevation-principle-shadow {
      display: flex;
      justify-content: flex-start;
      padding-left: 40px;
    }
    
    .demo-surface {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      background-color: var(--mtrl-sys-color-primary-container);
      color: var(--mtrl-sys-color-on-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      position: relative;
      margin-right: -40px;
    }
    
    .elevation-principle-hierarchy {
      flex-direction: column;
      justify-content: space-around;
    }
    
    .elevation-principle-hierarchy .demo-surface {
      margin: 12px 0;
      width: 180px;
      margin-right: 0;
    }
    
    .demo-primary {
      background-color: var(--mtrl-sys-color-primary);
      color: var(--mtrl-sys-color-on-primary);
      z-index: 3;
    }
    
    .demo-secondary {
      background-color: var(--mtrl-sys-color-secondary-container);
      color: var(--mtrl-sys-color-on-secondary-container);
      z-index: 2;
    }
    
    .demo-tertiary {
      background-color: var(--mtrl-sys-color-tertiary-container);
      color: var(--mtrl-sys-color-on-tertiary-container);
      z-index: 1;
    }
    
    .elevation-principle-surface {
      flex-wrap: wrap;
      justify-content: space-around;
    }
    
    .elevation-principle-surface .demo-surface {
      margin: 8px;
      width: 70px;
      height: 70px;
    }
    
    .surface-level-0 {
      background-color: var(--mtrl-sys-color-surface);
      color: var(--mtrl-sys-color-on-surface);
    }
    
    .surface-level-1 {
      background-color: var(--mtrl-sys-color-surface-container-low);
      color: var(--mtrl-sys-color-on-surface);
    }
    
    .surface-level-2 {
      background-color: var(--mtrl-sys-color-surface-container);
      color: var(--mtrl-sys-color-on-surface);
    }
    
    .surface-level-3 {
      background-color: var(--mtrl-sys-color-surface-container-high);
      color: var(--mtrl-sys-color-on-surface);
    }
    
    /* Dynamic elevation */
    .dynamic-elevation-container {
      margin-top: 24px;
    }
    
    .dynamic-card {
      border-radius: 12px;
      padding: 24px;
      background-color: var(--mtrl-sys-color-surface);
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .dynamic-card:hover {
      transform: translateY(-3px);
    }
    
    .dynamic-card-content {
      text-align: center;
    }
    
    .dynamic-card-title {
      margin: 0 0 12px 0;
    }
    
    .dynamic-card-description {
      margin-bottom: 24px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .dynamic-button-container {
      margin-top: 16px;
    }
    
    /* Elevation usage examples */
    .elevation-usage-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 24px;
      margin-top: 24px;
    }
    
    .usage-container {
      display: flex;
      flex-direction: column;
    }
    
    .component-example {
      height: 140px;
      border-radius: 12px;
      background-color: var(--mtrl-sys-color-surface);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      margin-bottom: 16px;
    }
    
    .component-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-bottom: 12px;
      background-color: var(--mtrl-sys-color-primary-container);
    }
    
    .component-name {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .component-elevation {
      font-size: 0.85rem;
      color: var(--mtrl-sys-color-on-surface-variant);
    }
    
    .component-description {
      font-size: 0.9rem;
      color: var(--mtrl-sys-color-on-surface-variant);
      margin: 0;
    }
    
    /* Code examples */
    .code-block {
      background-color: var(--mtrl-sys-color-surface-container);
      padding: 16px;
      border-radius: 8px;
      overflow: auto;
      font-family: monospace;
      margin: 12px 0 24px 0;
    }
    
    /* Custom component icons */
    .component-card {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm0 2v14h18V5H3z' fill='currentColor'/%3E%3C/svg%3E");
      background-position: center;
      background-repeat: no-repeat;
    }
    
    .component-dialog {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5z' fill='currentColor'/%3E%3Cpath d='M7 9h10v2H7V9zm0 4h10v2H7v-2z' fill='currentColor'/%3E%3C/svg%3E");
      background-position: center;
      background-repeat: no-repeat;
    }
    
    .component-navigation-bar {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M3 4h18v2H3V4zm0 7h12v2H3v-2zm0 7h18v2H3v-2z' fill='currentColor'/%3E%3C/svg%3E");
      background-position: center;
      background-repeat: no-repeat;
    }
    
    .component-floating-action-button {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z' fill='currentColor'/%3E%3C/svg%3E");
      background-position: center;
      background-repeat: no-repeat;
    }
    
    /* Dark mode adjustments */
    [data-theme-mode="dark"] .elevation-1 {
      box-shadow: 0 1px 3px rgba(0,0,0,0.24), 0 1px 2px rgba(0,0,0,0.36);
    }
    
    [data-theme-mode="dark"] .elevation-2 {
      box-shadow: 0 3px 6px rgba(0,0,0,0.28), 0 2px 4px rgba(0,0,0,0.24);
    }
    
    [data-theme-mode="dark"] .elevation-3 {
      box-shadow: 0 10px 20px rgba(0,0,0,0.28), 0 3px 6px rgba(0,0,0,0.22);
    }
    
    [data-theme-mode="dark"] .elevation-4 {
      box-shadow: 0 14px 28px rgba(0,0,0,0.35), 0 10px 10px rgba(0,0,0,0.28);
    }
    
    [data-theme-mode="dark"] .elevation-5 {
      box-shadow: 0 19px 38px rgba(0,0,0,0.40), 0 15px 12px rgba(0,0,0,0.32);
    }
  `
  document.head.appendChild(style)
}

// Run this function when the module loads
addElevationStyles()
