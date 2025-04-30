// src/client/content/components/cards/elevated.js

import {
  createComponentSection
} from '../../../layout'

import {
  createElement,
  createLayout,
  createCard,
  createCardHeader,
  createCardContent,
  CARD_VARIANTS
} from 'mtrl'

import { artworks } from './artwork-data'

/**
 * Initialize elevated cards with shadow effects
 * Demonstrates MD3 elevation system with proper shadow levels
 *
 * @param {HTMLElement} container - The container element
 */
export const initElevatedCards = (container) => {
  const title = 'Elevated Cards'
  const description = 'Cards with shadow elevation effect following MD3 elevation system (levels 1, 2, and 4)'

  const layout = createLayout(createComponentSection({ title, description }), container).component

  // Create elevated cards with increasing elevation levels
  ;[1, 2].forEach((elevation, index) => {
    const artwork = artworks[index + 3] // Use different artworks

    const card = createCard({
      variant: CARD_VARIANTS.ELEVATED,
      interactive: true,
      aria: {
        label: `Elevated card with ${elevation.name}`,
        describedby: `card-elevation-desc-${index}`
      }
    })

    // Set custom elevation level
    card.element.style.setProperty('--card-elevation', elevation.level)

    const header = createCardHeader({
      title: artwork.title,
      subtitle: `${artwork.artist}, ${artwork.year}`
    })

    // Create level indicator
    const elevationIndicator = createElement({
      tag: 'div',
      class: 'art-style-tag',
      text: `Elevation: ${elevation.name}`
    })

    // Create content with elevation description
    const content = createCardContent({})

    // Add description with ID for aria-describedby
    const description = document.createElement('p')
    description.id = `card-elevation-desc-${index}`
    description.textContent = artwork.description
    content.appendChild(description)

    // Add elevation note
    const elevationNote = document.createElement('p')
    elevationNote.style.marginTop = '8px'
    elevationNote.style.fontSize = '0.875rem'
    elevationNote.style.color = 'var(--mtrl-sys-color-on-surface-variant)'
    elevationNote.textContent = `This card demonstrates the MD3 elevation level ${elevation.level}.`
    content.appendChild(elevationNote)

    content.appendChild(elevationIndicator)

    // Assemble card
    card.setHeader(header)
    card.addContent(content)

    // Add hover effect description for the second card
    if (index === 1) {
      const hoverNote = document.createElement('div')
      hoverNote.style.marginTop = '8px'
      hoverNote.style.fontSize = '0.75rem'
      hoverNote.textContent = 'This is the same elevation that appears on hover for interactive cards'
      content.appendChild(hoverNote)
    }

    // Add dragging effect description for the third card
    if (index === 2) {
      const dragNote = document.createElement('div')
      dragNote.style.marginTop = '8px'
      dragNote.style.fontSize = '0.75rem'
      dragNote.textContent = 'This is the elevation applied when cards are being dragged'
      content.appendChild(dragNote)
    }

    layout.showcase.appendChild(card.element)
  })
}
