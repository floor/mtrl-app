// src/client/content/components/cards/swipeable.js

import {
  createComponentsSectionLayout
} from '../../../config'

import {
  createElement,
  createLayout,
  createButton
} from 'mtrl'

import { artworks, getPlaceholderUrl } from './artwork-data'
import createCard, {
  createCardHeader,
  createCardContent,
  createCardMedia,
  CARD_VARIANTS,
  withSwipeable
} from 'mtrl/src/components/card'

/**
 * Initialize swipeable cards
 * Demonstrates swipe gestures with accessible alternatives
 *
 * @param {HTMLElement} container - The container element
 */
export const initSwipeableCard = (container) => {
  const title = 'Swipeable Cards'
  const description = 'Cards with swipe gesture interactions and accessible alternatives'

  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create a swipeable card
  const artwork = artworks[8] // American Gothic

  // Counter for card actions
  let archiveCount = 0
  let deleteCount = 0

  // Create base card
  const baseCard = createCard({
    variant: CARD_VARIANTS.ELEVATED,
    aria: {
      label: 'Swipeable card demonstration',
      description: 'Swipe left to delete, swipe right to archive, or use the buttons below'
    }
  })

  // Create handler functions
  const handleSwipeLeft = (card) => {
    deleteCount++
    updateCountDisplay()
    setTimeout(() => card.swipeable.reset(), 500)
  }

  const handleSwipeRight = (card) => {
    archiveCount++
    updateCountDisplay()
    setTimeout(() => card.swipeable.reset(), 500)
  }

  // Enhance card with swipeable functionality
  const card = withSwipeable({
    threshold: 100,
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight
  })(baseCard)

  // Create card media
  const media = createCardMedia({
    src: getPlaceholderUrl(artwork),
    alt: `${artwork.title} by ${artwork.artist}`,
    aspectRatio: '16:9'
  })

  // Create header
  const header = createCardHeader({
    title: 'Swipeable Card Demo',
    subtitle: `Using ${artwork.title} by ${artwork.artist}`
  })

  // Create content
  const content = createCardContent({})

  // Add artwork description
  const artworkDescription = document.createElement('p')
  artworkDescription.textContent = artwork.description
  content.appendChild(artworkDescription)

  // Add swipe instructions
  const swipeInstructions = createElement({
    tag: 'div',
    style: 'margin-top: 16px;',
    html: '<div class="swipe-indicator">Swipe left: Delete • Swipe right: Archive</div>'
  })
  content.appendChild(swipeInstructions)

  // Create accessible buttons for non-touch users
  const buttonContainer = createElement({
    tag: 'div',
    style: 'display: flex; gap: 8px; margin-top: 16px; justify-content: center;'
  })

  // Create delete button
  const deleteButton = createButton({
    text: 'Delete',
    variant: 'outlined',
    ariaLabel: 'Delete item',
    onClick: () => handleSwipeLeft(card)
  }).element
  buttonContainer.appendChild(deleteButton)

  // Create archive button
  const archiveButton = createButton({
    text: 'Archive',
    variant: 'outlined',
    ariaLabel: 'Archive item',
    onClick: () => handleSwipeRight(card)
  }).element
  buttonContainer.appendChild(archiveButton)

  content.appendChild(buttonContainer)

  // Create counter display
  const counterDisplay = createElement({
    tag: 'div',
    style: 'margin-top: 16px; text-align: center; font-size: 0.875rem;',
    id: 'swipe-counter-display',
    text: 'Actions: Archive (0) • Delete (0)'
  })
  content.appendChild(counterDisplay)

  // Create accessibility note
  const a11yNote = createElement({
    tag: 'p',
    style: 'margin-top: 12px; font-size: 0.875rem; color: var(--mtrl-sys-color-on-surface-variant);',
    text: 'This card provides button alternatives for swipe gestures to ensure keyboard accessibility'
  })
  content.appendChild(a11yNote)

  // Function to update counter display
  const updateCountDisplay = () => {
    const display = document.getElementById('swipe-counter-display')
    if (display) {
      display.textContent = `Actions: Archive (${archiveCount}) • Delete (${deleteCount})`
    }
  }

  // Assemble card
  card.addMedia(media)
  card.setHeader(header)
  card.addContent(content)

  // Add card to grid
  layout.body.appendChild(card.element)
}
