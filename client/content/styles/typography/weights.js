// src/client/content/styles/typography/weights.js
import { fLayout, createElement } from 'mtrl'

/**
 * Creates the Font Weights section
 * @param {HTMLElement} container - Parent container
 */
export const createFontWeightsSection = (container) => {
  const sectionStructure = fLayout([
    'section', { tag: 'section', class: 'mtrl-content__section' },
    [
      'title', { tag: 'h2', class: 'mtrl-content__section-title', text: 'Font Weights' },
      'description', {
        tag: 'p',
        class: 'content__description',
        text: 'Font weights help create emphasis and establish hierarchy within text.'
      },
      'weights', { id: 'fontWeights', class: 'mtrl-font-weights-container' }
    ]
  ], container)

  // Initialize content for the weights section
  initFontWeights(sectionStructure.get('weights'))
}

/**
 * Initializes the font weights content
 * @param {HTMLElement} container - Container for the content
 */
export const initFontWeights = (container) => {
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
      class: 'mtrl-font-weight-item'
    })

    const weightSample = createElement({
      tag: 'div',
      class: 'mtrl-font-weight__sample',
      text: 'Aa',
      style: `font-weight: ${weight.value};`
    })

    const weightInfo = createElement({
      tag: 'div',
      class: 'mtrl-font-weight__info'
    })

    const weightName = createElement({
      tag: 'div',
      class: 'mtrl-font-weight__name',
      text: weight.name
    })

    const weightValue = createElement({
      tag: 'div',
      class: 'mtrl-font-weight__value',
      text: weight.value
    })

    weightInfo.appendChild(weightName)
    weightInfo.appendChild(weightValue)
    weightContainer.appendChild(weightSample)
    weightContainer.appendChild(weightInfo)

    container.appendChild(weightContainer)
  })
}
