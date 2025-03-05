// src/client/content/components/cards/filled.js

import { createCardSection, createCardGrid } from './helpers'
import { artworks } from './artwork-data'
import { createElement, createButton } from 'mtrl'
import createCard, {
  createCardHeader,
  createCardContent,
  createCardActions,
  CARD_VARIANTS
} from 'mtrl/src/components/card'

// Filled cards with background color
export const initFilledCards = (container) => {
  const title = 'Filled Cards'
  const description = 'Cards with filled background color'

  const section = createCardSection(title, description)
  const grid = createCardGrid()

  // Create filled cards
  artworks.slice(6, 9).forEach(artwork => {
    const card = createCard({
      variant: CARD_VARIANTS.FILLED,
      interactive: true
    })

    const header = createCardHeader({
      title: artwork.title,
      subtitle: artwork.artist
    })

    const content = createCardContent({
      text: artwork.description
    })

    // Add a style tag
    const styleTag = createElement({
      tag: 'span',
      class: 'art-style-tag',
      text: artwork.style
    })

    const actions = createCardActions({
      actions: [styleTag],
      align: 'start'
    })

    card.setHeader(header)
    card.addContent(content)
    card.setActions(actions)

    grid.appendChild(card.element)
  })

  section.appendChild(grid)
  container.appendChild(section)
}
