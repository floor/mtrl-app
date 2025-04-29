// src/client/content/styles/layout-utils.js

/**
 * Utility functions for the layout examples
 *
 * This file provides utility functions and event handlers
 * for the interactive layout demonstrations
 */

// Add class to track media queries for responsive demonstrations
document.addEventListener('DOMContentLoaded', () => {
  const setResponsiveClass = () => {
    const width = window.innerWidth
    const body = document.body

    // Clear existing size classes
    body.classList.remove('size-xs', 'size-sm', 'size-md', 'size-lg', 'size-xl')

    // Set appropriate size class
    if (width < 600) {
      body.classList.add('size-xs')
    } else if (width < 905) {
      body.classList.add('size-sm')
    } else if (width < 1240) {
      body.classList.add('size-md')
    } else if (width < 1440) {
      body.classList.add('size-lg')
    } else {
      body.classList.add('size-xl')
    }
  }

  // Initial setup
  setResponsiveClass()

  // Update on resize
  window.addEventListener('resize', setResponsiveClass)
})

// Handle grid item interactions
export const setupGridInteractions = (gridContainer) => {
  if (!gridContainer) return

  const gridItems = gridContainer.querySelectorAll('.layout-demo__grid-item')

  gridItems.forEach(item => {
    item.addEventListener('click', () => {
      // Toggle 'expanded' class on click
      item.classList.toggle('expanded')

      // If in dense layout, this will affect the grid flow
      if (gridContainer.classList.contains('dense')) {
        // Force a slight layout recalculation
        gridContainer.style.display = 'none'
        setTimeout(() => {
          gridContainer.style.display = 'grid'
        }, 5)
      }
    })
  })
}

// Handle responsive demo interactions
export const setupResponsiveDemo = (demoContainer) => {
  if (!demoContainer) return

  // Add viewport size indicator
  const sizeIndicator = document.createElement('div')
  sizeIndicator.className = 'viewport-size-indicator'
  sizeIndicator.textContent = 'Resize browser to see responsive behavior'

  // Update the indicator text when viewport size changes
  const updateSizeIndicator = () => {
    const width = window.innerWidth
    let size = ''

    if (width < 600) size = 'xs (< 600px)'
    else if (width < 905) size = 'sm (600px - 904px)'
    else if (width < 1240) size = 'md (905px - 1239px)'
    else if (width < 1440) size = 'lg (1240px - 1439px)'
    else size = 'xl (≥ 1440px)'

    sizeIndicator.textContent = `Current viewport: ${width}px (${size})`
  }

  updateSizeIndicator()
  window.addEventListener('resize', updateSizeIndicator)

  // Add indicator to the demo
  demoContainer.parentNode.insertBefore(sizeIndicator, demoContainer.nextSibling)
}

// Add card interaction behaviors
export const setupCardInteractions = (cardContainer) => {
  if (!cardContainer) return

  const cards = cardContainer.querySelectorAll('.layout-demo__card')

  cards.forEach(card => {
    // Add hover effects
    card.addEventListener('mouseenter', () => {
      card.classList.add('hover')
    })

    card.addEventListener('mouseleave', () => {
      card.classList.remove('hover')
    })

    // Add click to expand/collapse
    card.addEventListener('click', () => {
      cards.forEach(c => {
        if (c !== card) c.classList.remove('expanded')
      })
      card.classList.toggle('expanded')
    })
  })
}
