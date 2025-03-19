// src/client/content/styles/typography.js

import {
  contentLayout
} from '../../layout'

import {
  createLayout,
  createElement,
  createButton
} from 'mtrl'

export const createTypographyContent = (container) => {
  const info = {
    title: 'Typography',
    description: 'Typography expresses hierarchy and brand presence through type styles'
  }
  const layout = createLayout(contentLayout(info), container).component

  const ui = createLayout(createTypographyLayout(), layout.body).component

  initFontScales(ui)
  initTypeRoles(ui)
  initFontWeights(ui)
  initTypographyDemo(ui)
}

export const initFontScales = (ui) => {
  const container = ui.scales

  // Display type scales with examples
  const scales = [
    { name: 'display-large', label: 'Display Large', sample: 'Aa' },
    { name: 'display-medium', label: 'Display Medium', sample: 'Aa' },
    { name: 'display-small', label: 'Display Small', sample: 'Aa' },
    { name: 'headline-large', label: 'Headline Large', sample: 'Aa' },
    { name: 'headline-medium', label: 'Headline Medium', sample: 'Aa' },
    { name: 'headline-small', label: 'Headline Small', sample: 'Aa' },
    { name: 'title-large', label: 'Title Large', sample: 'Aa' },
    { name: 'title-medium', label: 'Title Medium', sample: 'Aa' },
    { name: 'title-small', label: 'Title Small', sample: 'Aa' }
  ]

  scales.forEach(scale => {
    const scaleContainer = createElement({
      tag: 'div',
      class: 'type-scale-item'
    })

    const sampleText = createElement({
      tag: 'span',
      class: `type-scale__sample type-${scale.name}`,
      text: scale.sample
    })

    const detailsContainer = createElement({
      tag: 'div',
      class: 'type-scale__details'
    })

    const scaleLabel = createElement({
      tag: 'div',
      class: 'type-scale__label',
      text: scale.label
    })

    const scaleInfo = createElement({
      tag: 'div',
      class: 'type-scale__info',
      attributes: {
        'data-scale': scale.name
      }
    })

    detailsContainer.appendChild(scaleLabel)
    detailsContainer.appendChild(scaleInfo)
    scaleContainer.appendChild(sampleText)
    scaleContainer.appendChild(detailsContainer)

    container.appendChild(scaleContainer)
  })

  // Add body text scales separately
  const bodyScales = [
    { name: 'body-large', label: 'Body Large', sample: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { name: 'body-medium', label: 'Body Medium', sample: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { name: 'body-small', label: 'Body Small', sample: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { name: 'label-large', label: 'Label Large', sample: 'BUTTON TEXT' },
    { name: 'label-medium', label: 'Label Medium', sample: 'BUTTON TEXT' },
    { name: 'label-small', label: 'Label Small', sample: 'BUTTON TEXT' }
  ]

  bodyScales.forEach(scale => {
    const scaleContainer = createElement({
      tag: 'div',
      class: 'type-scale-item body-scale-item'
    })

    const sampleText = createElement({
      tag: 'div',
      class: `type-scale__body-sample type-${scale.name}`,
      text: scale.sample
    })

    const detailsContainer = createElement({
      tag: 'div',
      class: 'type-scale__details'
    })

    const scaleLabel = createElement({
      tag: 'div',
      class: 'type-scale__label',
      text: scale.label
    })

    const scaleInfo = createElement({
      tag: 'div',
      class: 'type-scale__info',
      attributes: {
        'data-scale': scale.name
      }
    })

    detailsContainer.appendChild(scaleLabel)
    detailsContainer.appendChild(scaleInfo)
    scaleContainer.appendChild(sampleText)
    scaleContainer.appendChild(detailsContainer)

    ui.bodyScales.appendChild(scaleContainer)
  })
}

export const initTypeRoles = (ui) => {
  const container = ui.roles

  // Create typography role examples
  const roles = [
    {
      role: 'Page Title',
      scale: 'headline-large',
      sample: 'Page Title',
      description: 'Used for primary headings and page titles.'
    },
    {
      role: 'Section Heading',
      scale: 'headline-medium',
      sample: 'Section Heading',
      description: 'Used for major section headings.'
    },
    {
      role: 'Subsection Heading',
      scale: 'headline-small',
      sample: 'Subsection Heading',
      description: 'Used for subsection headings.'
    },
    {
      role: 'Card Title',
      scale: 'title-medium',
      sample: 'Card Title',
      description: 'Used for card titles and smaller UI elements.'
    },
    {
      role: 'Body Text',
      scale: 'body-medium',
      sample: 'This is standard body text used for paragraphs and general content.',
      description: 'Used for the main body content.'
    },
    {
      role: 'Button Label',
      scale: 'label-large',
      sample: 'BUTTON TEXT',
      description: 'Used for button labels and interactive elements.'
    }
  ]

  roles.forEach(role => {
    const roleContainer = createElement({
      tag: 'div',
      class: 'type-role-item'
    })

    const roleHeader = createElement({
      tag: 'div',
      class: 'type-role__header'
    })

    const roleTitle = createElement({
      tag: 'h3',
      class: 'type-role__title',
      text: role.role
    })

    const roleScale = createElement({
      tag: 'div',
      class: 'type-role__scale',
      text: role.scale
    })

    const sampleText = createElement({
      tag: 'div',
      class: `type-role__sample type-${role.scale}`,
      text: role.sample
    })

    const roleDescription = createElement({
      tag: 'div',
      class: 'type-role__description',
      text: role.description
    })

    roleHeader.appendChild(roleTitle)
    roleHeader.appendChild(roleScale)
    roleContainer.appendChild(roleHeader)
    roleContainer.appendChild(sampleText)
    roleContainer.appendChild(roleDescription)

    container.appendChild(roleContainer)
  })
}

export const initFontWeights = (ui) => {
  const container = ui.weights

  // Font weight examples
  const weights = [
    { value: '300', name: 'Light' },
    { value: '400', name: 'Regular' },
    { value: '500', name: 'Medium' },
    { value: '700', name: 'Bold' }
  ]

  weights.forEach(weight => {
    const weightContainer = createElement({
      tag: 'div',
      class: 'font-weight-item'
    })

    const weightSample = createElement({
      tag: 'div',
      class: 'font-weight__sample',
      text: 'Aa',
      style: `font-weight: ${weight.value};`
    })

    const weightInfo = createElement({
      tag: 'div',
      class: 'font-weight__info'
    })

    const weightName = createElement({
      tag: 'div',
      class: 'font-weight__name',
      text: weight.name
    })

    const weightValue = createElement({
      tag: 'div',
      class: 'font-weight__value',
      text: weight.value
    })

    weightInfo.appendChild(weightName)
    weightInfo.appendChild(weightValue)
    weightContainer.appendChild(weightSample)
    weightContainer.appendChild(weightInfo)

    container.appendChild(weightContainer)
  })
}

export const initTypographyDemo = (ui) => {
  const container = ui.demo

  // Create a typography demo with interactive elements
  const demoContent = createElement({
    tag: 'div',
    class: 'typography-demo__content'
  })

  // Headline
  const headline = createElement({
    tag: 'h1',
    class: 'type-headline-large',
    text: 'Typography in MTRL'
  })

  // Subheadline
  const subheadline = createElement({
    tag: 'h2',
    class: 'type-headline-small',
    text: 'Create a consistent reading experience'
  })

  // Body text
  const bodyText = createElement({
    tag: 'p',
    class: 'type-body-medium',
    text: 'Good typography makes the reading experience comfortable and helps create clear hierarchies. The MTRL framework provides a comprehensive typography system that helps maintain consistent type styles across your application.'
  })

  // Quote
  const quote = createElement({
    tag: 'blockquote',
    class: 'typography-demo__quote type-title-medium',
    text: '"Typography is what language looks like."'
  })

  const quoteAttribution = createElement({
    tag: 'cite',
    class: 'type-body-small',
    text: '— Ellen Lupton'
  })

  // Controls
  const controls = createElement({
    tag: 'div',
    class: 'typography-demo__controls'
  })

  const fontSizeControl = createButton({
    text: 'Increase Font Size',
    variant: 'outlined',
    class: 'font-size-control'
  })

  const fontWeightControl = createButton({
    text: 'Toggle Font Weight',
    variant: 'outlined',
    class: 'font-weight-control'
  })

  fontSizeControl.on('click', () => {
    const currentSize = parseInt(window.getComputedStyle(demoContent).fontSize)
    const newSize = currentSize >= 20 ? 16 : currentSize + 2
    demoContent.style.fontSize = `${newSize}px`
    fontSizeControl.setText(newSize > 16 ? 'Reset Font Size' : 'Increase Font Size')
  })

  fontWeightControl.on('click', () => {
    const isBold = demoContent.classList.contains('bold-text')
    if (isBold) {
      demoContent.classList.remove('bold-text')
      fontWeightControl.setText('Make Text Bold')
    } else {
      demoContent.classList.add('bold-text')
      fontWeightControl.setText('Reset Font Weight')
    }
  })

  // Assemble all elements
  quote.appendChild(quoteAttribution)
  demoContent.appendChild(headline)
  demoContent.appendChild(subheadline)
  demoContent.appendChild(bodyText)
  demoContent.appendChild(quote)

  controls.appendChild(fontSizeControl.element)
  controls.appendChild(fontWeightControl.element)

  container.appendChild(demoContent)
  container.appendChild(controls)
}

export const createTypographyLayout = () => [
  // Display & Headline Scales Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Type Scales: Display & Headline' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Type scales establish visual hierarchy and maintain consistency. Display and headline styles are used for larger text elements like headings.' }],
    [createElement, 'scales', { id: 'scales', class: 'type-scales-container' }]
  ],

  // Body & Label Scales Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Type Scales: Body & Label' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Body and label styles are used for paragraph text, buttons, and other UI elements.' }],
    [createElement, 'bodyScales', { id: 'bodyScales', class: 'type-scales-container' }]
  ],

  // Typography Roles Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Typography Roles' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Typography roles provide common use cases for the different type scales in your application.' }],
    [createElement, 'roles', { id: 'roles', class: 'type-roles-container' }]
  ],

  // Font Weights Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Font Weights' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Font weights help create emphasis and establish hierarchy within text.' }],
    [createElement, 'weights', { id: 'weights', class: 'font-weights-container' }]
  ],

  // Typography Demo Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Typography Demo' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'See how typography scales work together to create a coherent reading experience.' }],
    [createElement, 'demo', { id: 'demo', class: 'typography-demo' }]
  ],

  // Using Typography in Code Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Using Typography in Code' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Learn how to use typography scales in your SCSS and JavaScript code.' }],
    [createElement, { tag: 'div', class: 'code-examples' },
      [createElement, { tag: 'h3', text: 'SCSS Usage' }],
      [createElement, {
        tag: 'pre', class: 'code-block', text: `@use 'mtrl/src/styles/abstract/config' as c;

.my-heading {
  @include c.typography('headline-large');
}

.my-paragraph {
  @include c.typography('body-medium');
  
  strong {
    font-weight: 500; // Using defined weights
  }
}`
      }],
      [createElement, { tag: 'h3', text: 'JavaScript Component Usage' }],
      [createElement, {
        tag: 'pre', class: 'code-block', text: `// Creating a component with typography styles
const heading = createElement({
  tag: 'h1',
  class: 'type-headline-large',
  text: 'My Heading'
});

// Dynamically changing typography
element.classList.add('type-body-large');
element.classList.remove('type-body-medium');`
      }]
    ]
  ]
]

// Add custom styles for the typography documentation
const addTypographyStyles = () => {
  const style = document.createElement('style')
  style.textContent = `
    /* Type scale containers */
    .type-scales-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      margin-top: 24px;
    }
    
    .type-scale-item {
      display: flex;
      align-items: center;
      border-radius: 8px;
      padding: 16px;
      background-color: var(--mtrl-sys-color-surface-container-low);
      transition: transform 0.2s ease;
    }
    
    .type-scale-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .body-scale-item {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .type-scale__sample {
      font-size: 32px;
      margin-right: 16px;
      min-width: 50px;
      text-align: center;
    }
    
    .type-scale__body-sample {
      margin-bottom: 16px;
      width: 100%;
    }
    
    .type-scale__details {
      flex: 1;
    }
    
    .type-scale__label {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .type-scale__info {
      font-size: 0.85rem;
      color: var(--mtrl-sys-color-on-surface-variant);
    }
    
    /* Typography roles */
    .type-roles-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      margin-top: 24px;
    }
    
    .type-role-item {
      border-radius: 8px;
      padding: 16px;
      background-color: var(--mtrl-sys-color-surface-container-low);
      transition: transform 0.2s ease;
    }
    
    .type-role-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .type-role__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .type-role__title {
      margin: 0;
      font-weight: 500;
    }
    
    .type-role__scale {
      font-size: 0.85rem;
      color: var(--mtrl-sys-color-on-surface-variant);
      padding: 4px 8px;
      background-color: var(--mtrl-sys-color-surface-variant);
      border-radius: 4px;
      color: var(--mtrl-sys-color-on-surface);
    }
    
    .type-role__sample {
      margin-bottom: 16px;
    }
    
    .type-role__description {
      font-size: 0.85rem;
      color: var(--mtrl-sys-color-on-surface-variant);
    }
    
    /* Font weights */
    .font-weights-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 24px;
      margin-top: 24px;
    }
    
    .font-weight-item {
      border-radius: 8px;
      padding: 16px;
      background-color: var(--mtrl-sys-color-surface-container-low);
      text-align: center;
      transition: transform 0.2s ease;
    }
    
    .font-weight-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .font-weight__sample {
      font-size: 32px;
      margin-bottom: 12px;
    }
    
    .font-weight__name {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .font-weight__value {
      font-size: 0.85rem;
      color: var(--mtrl-sys-color-on-surface-variant);
    }
    
    /* Typography demo */
    .typography-demo {
      border-radius: 8px;
      padding: 24px;
      background-color: var(--mtrl-sys-color-surface-container-low);
      margin-top: 24px;
    }
    
    .typography-demo__content {
      margin-bottom: 24px;
    }
    
    .typography-demo__content.bold-text {
      font-weight: 700;
    }
    
    .typography-demo__content h1 {
      margin-bottom: 8px;
    }
    
    .typography-demo__content h2 {
      margin-bottom: 16px;
      color: var(--mtrl-sys-color-on-surface-variant);
    }
    
    .typography-demo__content p {
      margin-bottom: 24px;
      max-width: 800px;
    }
    
    .typography-demo__quote {
      font-style: italic;
      border-left: 4px solid var(--mtrl-sys-color-primary);
      padding-left: 16px;
      margin-bottom: 8px;
    }
    
    .typography-demo__quote cite {
      display: block;
      text-align: right;
      margin-top: 8px;
    }
    
    .typography-demo__controls {
      display: flex;
      gap: 12px;
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
    
    /* Type scale classes */
    .type-display-large { font-size: 3.5rem; line-height: 4rem; font-weight: 400; }
    .type-display-medium { font-size: 2.8rem; line-height: 3.25rem; font-weight: 400; }
    .type-display-small { font-size: 2.25rem; line-height: 2.75rem; font-weight: 400; }
    
    .type-headline-large { font-size: 2rem; line-height: 2.5rem; font-weight: 500; }
    .type-headline-medium { font-size: 1.75rem; line-height: 2.25rem; font-weight: 500; }
    .type-headline-small { font-size: 1.5rem; line-height: 2rem; font-weight: 500; }
    
    .type-title-large { font-size: 1.375rem; line-height: 1.75rem; font-weight: 500; }
    .type-title-medium { font-size: 1rem; line-height: 1.5rem; font-weight: 500; }
    .type-title-small { font-size: 0.875rem; line-height: 1.25rem; font-weight: 500; }
    
    .type-body-large { font-size: 1rem; line-height: 1.5rem; font-weight: 400; }
    .type-body-medium { font-size: 0.875rem; line-height: 1.25rem; font-weight: 400; }
    .type-body-small { font-size: 0.75rem; line-height: 1rem; font-weight: 400; }
    
    .type-label-large { font-size: 0.875rem; line-height: 1.25rem; font-weight: 500; letter-spacing: 0.03em; }
    .type-label-medium { font-size: 0.75rem; line-height: 1rem; font-weight: 500; letter-spacing: 0.03em; }
    .type-label-small { font-size: 0.6875rem; line-height: 0.9375rem; font-weight: 500; letter-spacing: 0.03em; }
  `
  document.head.appendChild(style)
}

// Run this function when the module loads
addTypographyStyles()

// Helper function to update type scale info with actual values
const updateTypeScaleInfo = () => {
  // Wait for DOM to be ready
  requestAnimationFrame(() => {
    const infoElements = document.querySelectorAll('.type-scale__info')

    infoElements.forEach(element => {
      const scale = element.getAttribute('data-scale')
      if (!scale) return

      // Find an element with this scale to get computed style
      const sampleElement = document.querySelector(`.type-${scale}`)
      if (!sampleElement) return

      const styles = window.getComputedStyle(sampleElement)
      const fontSize = styles.fontSize
      const lineHeight = styles.lineHeight
      const fontWeight = styles.fontWeight

      element.textContent = `${fontSize} / ${lineHeight} / ${fontWeight}`
    })
  })
}

// Call after module is loaded
setTimeout(updateTypeScaleInfo, 100)
