// src/client/content/styles/typography/scales.js
import { createLayout, createElement } from 'mtrl'

/**
 * Creates the Typography Scales section
 * @param {HTMLElement} container - Parent container
 */
export const createTypographyScalesSection = (container) => {
  // Create Display & Headline Scales Section
  const displayScalesStructure = createLayout([
    'section', { tag: 'section', class: 'mtrl-content__section' },
    [
      'title', { tag: 'h2', class: 'mtrl-content__section-title', text: 'Type Scales: Display & Headline' },
      'description', {
        tag: 'p',
        class: 'mtrl-content__description',
        text: 'Type scales establish visual hierarchy and maintain consistency. Display and headline styles are used for larger text elements like headings.'
      },
      'scales', { id: 'displayScales', class: 'mtrl-type-scales-container' }
    ]
  ], container)

  // Create Body & Label Scales Section
  const bodyScalesStructure = createLayout([
    'section', { tag: 'section', class: 'mtrl-content__section' },
    [
      'title', { tag: 'h2', class: 'mtrl-content__section-title', text: 'Type Scales: Body & Label' },
      'description', {
        tag: 'p',
        class: 'mtrl-content__description',
        text: 'Body and label styles are used for paragraph text, buttons, and other UI elements.'
      },
      'scales', { id: 'bodyScales', class: 'mtrl-type-scales-container' }
    ]
  ], container)

  // Initialize content for each section
  initDisplayScales(displayScalesStructure.get('scales'))
  initBodyScales(bodyScalesStructure.get('scales'))
}

/**
 * Initializes the display and headline type scales
 * @param {HTMLElement} container - Container for the scales
 */
const initDisplayScales = (container) => {
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

  createScaleItems(container, scales, false)
}

/**
 * Initializes the body and label type scales
 * @param {HTMLElement} container - Container for the scales
 */
const initBodyScales = (container) => {
  // Body text scales
  const bodyScales = [
    { name: 'body-large', label: 'Body Large', sample: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { name: 'body-medium', label: 'Body Medium', sample: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { name: 'body-small', label: 'Body Small', sample: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { name: 'label-large', label: 'Label Large', sample: 'BUTTON TEXT' },
    { name: 'label-medium', label: 'Label Medium', sample: 'BUTTON TEXT' },
    { name: 'label-small', label: 'Label Small', sample: 'BUTTON TEXT' }
  ]

  createScaleItems(container, bodyScales, true)
}

/**
 * Helper function to create scale items
 * @param {HTMLElement} container - Container for the scales
 * @param {Array} scales - Array of scale objects
 * @param {boolean} isBodyScale - Whether this is a body scale (affects layout)
 */
const createScaleItems = (container, scales, isBodyScale) => {
  scales.forEach(scale => {
    const scaleContainer = createElement({
      tag: 'div',
      class: isBodyScale ? 'mtrl-type-scale-item mtrl-body-scale-item' : 'mtrl-type-scale-item'
    })

    const sampleText = createElement({
      tag: isBodyScale ? 'div' : 'span',
      class: isBodyScale
        ? `mtrl-type-scale__body-sample mtrl-type-${scale.name}`
        : `mtrl-type-scale__sample mtrl-type-${scale.name}`,
      text: scale.sample
    })

    const detailsContainer = createElement({
      tag: 'div',
      class: 'mtrl-type-scale__details'
    })

    const scaleLabel = createElement({
      tag: 'div',
      class: 'mtrl-type-scale__label',
      text: scale.label
    })

    const scaleInfo = createElement({
      tag: 'div',
      class: 'mtrl-type-scale__info',
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
}

// Helper function to update type scale info with actual values
export const updateTypeScaleInfo = () => {
  // Wait for DOM to be ready
  requestAnimationFrame(() => {
    const infoElements = document.querySelectorAll('.mtrl-type-scale__info')

    infoElements.forEach(element => {
      const scale = element.getAttribute('data-scale')
      if (!scale) return

      // Find an element with this scale to get computed style
      const sampleElement = document.querySelector(`.mtrl-type-${scale}`)
      if (!sampleElement) return

      const styles = window.getComputedStyle(sampleElement)
      const fontSize = styles.fontSize
      const lineHeight = styles.lineHeight
      const fontWeight = styles.fontWeight

      element.textContent = `${fontSize} / ${lineHeight} / ${fontWeight}`
    })
  })
}

// Initialize the scale info after the page loads
setTimeout(updateTypeScaleInfo, 0)
