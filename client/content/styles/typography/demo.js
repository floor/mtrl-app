// src/client/content/styles/typography/demo.js
import { createLayout, createElement, createButton } from 'mtrl'

/**
 * Creates the Typography Demo section
 * @param {HTMLElement} container - Parent container
 */
export const createTypographyDemoSection = (container) => {
  const sectionStructure = createLayout([
    'section', { tag: 'section', class: 'mtrl-content__section' },
    [
      'title', { tag: 'h2', class: 'mtrl-content__section-title', text: 'Typography Demo' },
      'description', {
        tag: 'p',
        class: 'mtrl-content__description',
        text: 'See how typography scales work together to create a coherent reading experience.'
      },
      'demo', { id: 'typographyDemo', class: 'mtrl-typography-demo' }
    ]
  ], container)

  // Initialize content for the demo section
  initTypographyDemo(sectionStructure.get('demo'))
}

/**
 * Initializes the typography demo content
 * @param {HTMLElement} container - Container for the content
 */
export const initTypographyDemo = (container) => {
  // Create a typography demo with interactive elements
  const demoContent = createElement({
    tag: 'div',
    className: 'typography-demo__content'
  })

  // Headline
  const headline = createElement({
    tag: 'h1',
    className: 'type-headline-large',
    text: 'Typography in mtrl'
  })

  // Subheadline
  const subheadline = createElement({
    tag: 'h2',
    className: 'type-headline-small',
    text: 'Create a consistent reading experience'
  })

  // Body text
  const bodyText = createElement({
    tag: 'p',
    className: 'type-body-medium',
    text: 'Good typography makes the reading experience comfortable and helps create clear hierarchies. The mtrl framework provides a comprehensive typography system that helps maintain consistent type styles across your application.'
  })

  // Quote
  const quote = createElement({
    tag: 'blockquote',
    className: 'typography-demo__quote',
    text: '"Typography is what language looks like."'
  })

  const quoteAttribution = createElement({
    tag: 'cite',
    className: 'type-body-small',
    text: '— Ellen Lupton'
  })

  // Controls
  const controls = createElement({
    tag: 'div',
    className: 'typography-demo__controls'
  })

  const fontSizeControl = createButton({
    text: 'Increase Font Size',
    variant: 'outlined',
    className: 'font-size-control'
  })

  const fontWeightControl = createButton({
    text: 'Toggle Font Weight',
    variant: 'outlined',
    className: 'font-weight-control'
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
