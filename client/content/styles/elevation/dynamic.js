// src/client/content/styles/elevation/dynamic.js
import { createButton, createLayout } from 'mtrl'

/**
 * Creates the Dynamic Elevation section
 * @param {HTMLElement} container - Parent container
 */
export const createDynamicElevationSection = (container) => {
  const sectionStructure = createLayout([
    'section', { tag: 'section', class: 'mtrl-content__section' },
    [
      'title', { tag: 'h2', class: 'mtrl-content__section-title', text: 'Dynamic Elevation' },
      'description', {
        tag: 'p',
        class: 'mtrl-content__description',
        text: 'Elements can change elevation in response to user interaction, providing visual feedback and reinforcing relationships.'
      },
      'dynamic', { id: 'dynamic', class: 'dynamic-elevation-container' }
    ]
  ], container)

  // Initialize content for the dynamic section
  initDynamicElevation(sectionStructure.get('dynamic'))
}

/**
 * Initializes the dynamic elevation demonstration
 * @param {HTMLElement} container - Container for the content
 */
export const initDynamicElevation = (container) => {
  // Create dynamic elevation example
  const structure = createLayout([
    'card', { tag: 'div', class: 'dynamic-card elevation-1' },
    [
      'content', { tag: 'div', class: 'dynamic-card-content' },
      [
        'title', { tag: 'h3', class: 'dynamic-card-title', text: 'Dynamic Elevation' },
        'description', {
          tag: 'p',
          class: 'dynamic-card-description',
          text: 'Elements can change elevation in response to user interaction. Hover or click to see the elevation change.'
        },
        'buttonContainer', { tag: 'div', class: 'dynamic-button-container' }
      ]
    ]
  ], container)

  // Create and add the button
  const elevateButton = createButton({
    text: 'Elevate Card',
    variant: 'filled'
  })

  structure.get('buttonContainer').appendChild(elevateButton.element)

  // Set up the elevation cycling behavior
  let currentElevation = 1

  elevateButton.on('click', () => {
    // Cycle through elevations
    currentElevation = (currentElevation % 5) + 1

    // Remove all elevation classes
    const card = structure.get('card')
    for (let i = 0; i <= 5; i++) {
      card.classList.remove(`elevation-${i}`)
    }

    // Add new elevation class
    card.classList.add(`elevation-${currentElevation}`)

    // Update button text
    elevateButton.setText(`Elevation Level: ${currentElevation}`)
  })
}
