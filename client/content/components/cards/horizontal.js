// src/client/content/components/cards/horizontal.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createElement,
  createLayout
  , fButton
} from 'mtrl'
import { artworks, getPlaceholderUrl } from './artwork-data'
import createCard, {
  createCardHeader,
  createCardContent,
  createCardMedia,
  createCardActions,
  CARD_VARIANTS
} from 'mtrl/src/components/card'

/**
 * Initialize horizontal layout cards
 * Demonstrates custom layout while preserving accessibility
 *
 * @param {HTMLElement} container - The container element
 */
export const initHorizontalCards = (container) => {
  const title = 'Horizontal Cards'
  const description = 'Cards with custom horizontal layout for list views'

  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create horizontal cards
  artworks.slice(7, 10).forEach((artwork, index) => {
    // Create container for horizontal layout
    const horizontalContainer = createElement({
      tag: 'div',
      class: 'horizontal-card-container'
    })

    // Create the card with proper accessibility attributes
    const card = createCard({
      variant: CARD_VARIANTS.OUTLINED,
      fullWidth: true,
      interactive: index === 1, // Make the middle card interactive
      aria: {
        role: 'region',
        label: `Horizontal card about ${artwork.title}`,
        describedby: `horizontal-card-desc-${index}`
      }
    })

    // Create media with proper alt text
    const media = createCardMedia({
      src: getPlaceholderUrl(artwork),
      alt: `${artwork.title} by ${artwork.artist}`,
      aspectRatio: '1:1'
    })

    // Create content section
    const contentSection = createElement({
      tag: 'div',
      class: 'horizontal-card-content'
    })

    // Create header
    const header = createCardHeader({
      title: artwork.title,
      subtitle: `${artwork.artist}, ${artwork.year}`
    })

    // Create content
    const content = createCardContent({})

    // Add description with ID for aria-describedby
    const description = document.createElement('p')
    description.id = `horizontal-card-desc-${index}`
    description.textContent = artwork.description
    content.appendChild(description)

    // Add layout note
    const layoutNote = createElement({
      tag: 'p',
      style: 'margin-top: 8px; font-size: 0.875rem; color: var(--mtrl-sys-color-on-surface-variant)',
      text: 'This card uses a custom horizontal layout while maintaining accessibility'
    })
    content.appendChild(layoutNote)

    // Create style tag
    const styleTag = createElement({
      tag: 'span',
      class: 'art-style-tag',
      text: artwork.style
    })

    // Create view button
    const viewButton = fButton({
      text: 'View',
      variant: 'text',
      ariaLabel: `View details about ${artwork.title}`
    }).element

    // Create actions
    const actions = createCardActions({
      actions: [styleTag, viewButton],
      align: 'space-between'
    })

    // Add all elements to content section
    contentSection.appendChild(header)
    contentSection.appendChild(content)
    contentSection.appendChild(actions)

    // Horizontal layout setup - add to container first
    horizontalContainer.appendChild(media)
    horizontalContainer.appendChild(contentSection)

    // Add the horizontal container to the card
    card.element.appendChild(horizontalContainer)

    // Add responsive behavior note for the middle card
    if (index === 1) {
      const responsiveNote = createElement({
        tag: 'div',
        style: 'font-size: 0.75rem; text-align: center; margin-top: 8px; color: var(--mtrl-sys-color-on-surface-variant)',
        text: 'This layout is responsive - try resizing your window to see it change'
      })
      card.element.appendChild(responsiveNote)
    }

    // Add to list
    layout.showcase.appendChild(card.element)
  })
}
