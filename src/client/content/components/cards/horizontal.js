// src/client/content/components/cards/horizontal.js

import { createCardSection, createCardList } from './helpers'
import { artworks, getPlaceholderUrl } from './artwork-data'
import { createElement, createButton } from 'mtrl'
import createCard, {
  createCardHeader,
  createCardContent,
  createCardMedia,
  createCardActions,
  CARD_VARIANTS
} from 'mtrl/src/components/card'

// Horizontal cards
export const initHorizontalCards = (container) => {
  const title = 'Horizontal Cards'
  const description = 'Cards with horizontal layout'

  const section = createCardSection(title, description)
  const list = createCardList()

  // Create horizontal cards
  artworks.slice(7, 10).forEach(artwork => {
    // Create container for horizontal layout
    const horizontalContainer = createElement({
      tag: 'div',
      class: 'horizontal-card-container'
    })

    const card = createCard({
      variant: CARD_VARIANTS.OUTLINED,
      fullWidth: true
    })

    // Create media
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

    const header = createCardHeader({
      title: artwork.title,
      subtitle: `${artwork.artist}, ${artwork.year}`
    })

    const content = createCardContent({
      text: artwork.description
    })

    // Style tag
    const styleTag = createElement({
      tag: 'span',
      class: 'art-style-tag',
      text: artwork.style
    })

    // View button
    const viewButton = createButton({
      text: 'View',
      variant: 'text'
    }).element

    const actions = createCardActions({
      actions: [styleTag, viewButton],
      align: 'space-between'
    })

    // Add to content section
    contentSection.appendChild(header)
    contentSection.appendChild(content)
    contentSection.appendChild(actions)

    // Horizontal layout setup
    horizontalContainer.appendChild(media)
    horizontalContainer.appendChild(contentSection)

    // Add to card
    card.element.appendChild(horizontalContainer)

    list.appendChild(card.element)
  })

  section.appendChild(list)
  container.appendChild(section)
}
