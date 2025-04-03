// Function to initialize interactive layout examples

import { setupGridInteractions, setupResponsiveDemo, setupCardInteractions } from './utils'

export const initializeInteractiveLayouts = (container) => {
  // Setup grid interaction if the container has gridLayout section and utils are loaded
  const gridContainer = container.querySelector('.grid-layout')
  if (gridContainer && typeof setupGridInteractions === 'function') {
    setupGridInteractions(gridContainer)
  }

  // Setup responsive demo if the container has responsiveLayout section and utils are loaded
  const responsiveContainer = container.querySelector('.responsive-layout')
  if (responsiveContainer && typeof setupResponsiveDemo === 'function') {
    setupResponsiveDemo(responsiveContainer)
  }

  // Setup card interactions if the container has cardLayout section and utils are loaded
  const cardContainer = container.querySelector('.card-layout')
  if (cardContainer && typeof setupCardInteractions === 'function') {
    setupCardInteractions(cardContainer)
  }
}
